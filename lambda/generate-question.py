import json
import boto3
import uuid
import os
import openai
from botocore.exceptions import ClientError

# AWS Clients
s3 = boto3.client("s3")
dynamodb = boto3.client("dynamodb")
dynamodb_resource = boto3.resource("dynamodb")

# Environment Variables
TABLE_NAME = os.getenv("DYNAMODB_TABLE", "JDQuestions")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") 

# Initialize OpenAI client
openai_client = openai.Client(api_key=OPENAI_API_KEY)
print(f"OpenAI client initialized: {OPENAI_API_KEY is not None}")

def ensure_table_exists():
    """Ensure the DynamoDB table exists, create it if necessary."""
    try:
        dynamodb.describe_table(TableName=TABLE_NAME)
        print(f"Table '{TABLE_NAME}' already exists.")
    except ClientError as e:
        if e.response["Error"]["Code"] == "ResourceNotFoundException":
            print(f"Table '{TABLE_NAME}' not found. Creating...")
            dynamodb.create_table(
                TableName=TABLE_NAME,
                AttributeDefinitions=[
                    {"AttributeName": "jdId", "AttributeType": "S"},
                    {"AttributeName": "questionId", "AttributeType": "S"},
                ],
                KeySchema=[
                    {"AttributeName": "jdId", "KeyType": "HASH"},  # Partition key
                    {"AttributeName": "questionId", "KeyType": "RANGE"},  # Sort key
                ],
                BillingMode="PAY_PER_REQUEST",
            )
            waiter = dynamodb.get_waiter("table_exists")
            waiter.wait(TableName=TABLE_NAME)
            print(f" Table '{TABLE_NAME}' created successfully.")
        else:
            print("Error checking table:", e)
            raise e

def fetch_jd_from_s3(s3_url):
    if s3_url.startswith("s3://"):
        bucket, key = s3_url.replace("s3://", "").split("/", 1)
    else:
        bucket, key = s3_url.replace("https://", "").split(".s3.amazonaws.com/", 1)
    response = s3.get_object(Bucket=bucket, Key=key)
    return response["Body"].read().decode("utf-8")

def generate_questions(jd_text):
    """Call the OpenAI API to generate interview questions from job description text."""
    try:
        print("Calling OpenAI API...")
        response = openai_client.chat.completions.create(
            model="gpt-4o",  # Updated to gpt-4o as per your example; adjust if needed
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates interview questions in a specific JSON format."},
                {"role": "user", "content": f"Generate exactly 5 interview questions based on the following job description. Return ONLY a JSON object with the structure: {{\"question1\":\"first question\", \"question2\":\"second question\", ..., \"question5\":\"fifth question\"}}\n\nJob Description:\n{jd_text}"}
            ],
            max_tokens=500,
            temperature=0.7,
        )
        print("OpenAI API response:", response)
        
        # Extract questions from the response
        content = response.choices[0].message.content.strip()
        if content.startswith("```json") and content.endswith("```"):
            content = content[7:-3].strip()  
        questions_dict = json.loads(content)
        questions = list(questions_dict.values())
        return questions
    except Exception as e:
        print(f"Error with OpenAI API: {e}")
        return []

def store_questions(jdId, questions):
    """Store the generated questions in DynamoDB."""
    table = dynamodb_resource.Table(TABLE_NAME)
    for question in questions:
        question_id = str(uuid.uuid4())
        table.put_item(
            Item={
                "jdId": jdId,
                "questionId": question_id,
                "questionText": question,
                "generatedAt": str(uuid.uuid1()),  # Simplified timestamp
            }
        )

def lambda_handler(event, context):
    """AWS Lambda entry point."""
    try:
        print(f"Event received: {json.dumps(event)}")

        # Ensure the table exists
        ensure_table_exists()

        # Parse request body
        jdId = event["jdId"]
        s3Url = event["s3Url"]

        # Fetch JD content from S3
        jd_text = fetch_jd_from_s3(s3Url)

        # Generate questions from OpenAI
        questions = generate_questions(jd_text)

        if not questions:
            return {"statusCode": 500, "body": json.dumps({"message": "Failed to generate questions"})}

        # Store questions in DynamoDB
        store_questions(jdId, questions)

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Questions generated successfully",
                "jdId": jdId,
                "questions": questions
            })
        }

    except Exception as e:
        print("Error:", e)
        return {"statusCode": 500, "body": json.dumps({"message": "Error", "error": str(e)})}
