import json
import boto3
import time
import os
import openai
from botocore.exceptions import ClientError

# AWS Clients

dynamodb = boto3.client("dynamodb")
dynamodb_resource = boto3.resource("dynamodb")
transcribe_client = boto3.client("transcribe")
s3_client = boto3.client("s3")

print("Clients Initialized")

# Environment Variables
TABLE_NAME = os.getenv("DYNAMODB_TABLE", "QARecording")
FEEDBACK_TABLE = os.getenv("FEEDBACK_TABLE", "QAFeedback")
SOURCE_BUCKET = os.getenv("S3_SOURCE_BUCKET")
TARGET_BUCKET = os.getenv("TARGET_BUCKET")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
openai_client = openai.Client(api_key=OPENAI_API_KEY)

# Function to check if a table exists
def table_exists(table_name):

    try:
        dynamodb.describe_table(TableName=table_name)
        return True
    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceNotFoundException":
            return False
        raise

# Function to create table if it doesn't exist
def create_table(table_name, key_schema, attribute_definitions):
    print(f"Table {table_name} not found. Creating...")
    try:
        dynamodb.create_table(
            TableName=table_name,
            AttributeDefinitions=attribute_definitions,
            KeySchema=key_schema,
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
        )
        while not table_exists(table_name):
            print(f"⏳ Waiting for {table_name} to be ACTIVE...")
            time.sleep(5)
        print(f"Table {table_name} is now ACTIVE!")
    except ClientError as e:
        print(f"Error creating table {table_name}: {e}")
        raise

# Ensure both tables exist
if not table_exists(TABLE_NAME):
    create_table(TABLE_NAME, 
                 [{"AttributeName": "userId", "KeyType": "HASH"}, 
                  {"AttributeName": "questionId", "KeyType": "RANGE"}], 
                 [{"AttributeName": "userId", "AttributeType": "S"}, 
                  {"AttributeName": "questionId", "AttributeType": "S"}])

if not table_exists(FEEDBACK_TABLE):
    create_table(FEEDBACK_TABLE, 
                 [{"AttributeName": "userId", "KeyType": "HASH"}, 
                  {"AttributeName": "questionId", "KeyType": "RANGE"}], 
                 [{"AttributeName": "userId", "AttributeType": "S"}, 
                  {"AttributeName": "questionId", "AttributeType": "S"}])

# Lambda handler function
def lambda_handler(event, context):
    if not TARGET_BUCKET:
        return {"statusCode": 500, "body": json.dumps({"error": "TARGET_BUCKET environment variable is missing"})}
    if not table_exists(FEEDBACK_TABLE):
        print("⚠️ FEEDBACK_TABLE still not found after creation. Check CloudWatch logs.")

    print("Lambda Triggered")
    try:
        user_id = event.get("userId")
        question_id = event.get("questionId")

        if not user_id or not question_id:
            return {"statusCode": 400, "body": json.dumps({"error": "Missing userId or questionId"})}

        # Fetch Recording Data from DynamoDB
        table = dynamodb_resource.Table(TABLE_NAME)
        response = table.get_item(Key={"userId": user_id, "questionId": question_id})

        if "Item" not in response:
            return {"statusCode": 404, "body": json.dumps({"error": "Recording not found"})}

        record = response["Item"]
        s3_path = record["recordingUrl"]
        question_text = record["questionText"]

        # Step 1: Transcribe audio
        transcribe_job = transcribe_audio(s3_path, user_id, question_id)
        if not transcribe_job:
            return {"statusCode": 500, "body": json.dumps({"error": "Transcription failed"})}

        # Step 2: Retrieve Transcription Text
        transcript_text = get_transcription_text(transcribe_job["TranscriptionJobName"])
        if not transcript_text:
            return {"statusCode": 500, "body": json.dumps({"error": "Failed to fetch transcription result"})}

        # Step 3: Generate feedback using OpenAI
        feedback = generate_feedback(question_text, transcript_text)
        if not feedback:
            return {"statusCode": 500, "body": json.dumps({"error": "Feedback generation failed"})}

        # Step 4: Store feedback in DynamoDB
        save_feedback_to_dynamodb(user_id, question_id, feedback)

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Feedback generated successfully",
                "feedback": feedback
            })
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}

# Function to transcribe audio using AWS Transcribe
def transcribe_audio(s3_path, user_id, question_id):
    job_name = f"transcribe_{user_id}_{question_id}_{int(time.time())}"
    output_key = f"transcriptions/{job_name}.json"

    try:
        response = transcribe_client.start_transcription_job(
            TranscriptionJobName=job_name,
            LanguageCode='en-US',
            Media={'MediaFileUri': s3_path},
            OutputBucketName=TARGET_BUCKET,
            OutputKey=output_key
        )

        print("Transcription job started successfully:", json.dumps(response, default=str))

        return {
            'TranscriptionJobName': response['TranscriptionJob']['TranscriptionJobName'],
            'OutputKey': output_key
        }

    except ClientError as e:
        print(f"Error starting transcription job: {e}")
        return None

# Function to fetch transcription text
def get_transcription_text(job_name):
    for _ in range(10):  # Wait for transcription to complete
        status = transcribe_client.get_transcription_job(TranscriptionJobName=job_name)
        job_status = status["TranscriptionJob"]["TranscriptionJobStatus"]

        if job_status in ["COMPLETED", "FAILED"]:
            break
        time.sleep(5)

    if job_status == "COMPLETED":
        transcript_url = status["TranscriptionJob"]["Transcript"]["TranscriptFileUri"]
        transcript_data = s3_client.get_object(Bucket=TARGET_BUCKET, Key=f"transcriptions/{job_name}.json")
        transcript_text = json.loads(transcript_data["Body"].read().decode("utf-8"))["results"]["transcripts"][0]["transcript"]
        return transcript_text

    print("Transcription job failed or timed out")
    return None

# Function to get feedback from OpenAI
def generate_feedback(question, transcript):
    prompt = f"""
    You are an AI expert in interview assessments. The user answered the question:
    
    Question: {question}
    User's Answer: {transcript}

    Provide a concise and constructive feedback (max 3 sentences) on the user's answer.
    """

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI assistant providing interview feedback."},
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return None

# Function to save feedback in DynamoDB
def save_feedback_to_dynamodb(user_id, question_id, feedback):
    feedback_table = dynamodb_resource.Table(FEEDBACK_TABLE)
    feedback_table.put_item(
        Item={
            "userId": user_id,
            "questionId": question_id,
            "feedback": feedback,
            "timestamp": int(time.time())
        }
    )
