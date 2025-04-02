import { s3, dynamoDB, dynamoDBClient } from "../config/awsConfig.js";

const BUCKET_NAME = process.env.S3_BUCKET_NAME_RECORDING;
const TABLE_NAME = "QARecording";

// Ensure DynamoDB Table Exists
const ensureTableExists = async () => {
  try {
    const tables = await dynamoDBClient.listTables().promise();
    if (!tables.TableNames.includes(TABLE_NAME)) {
      console.log(`Creating table: ${TABLE_NAME}`);

      const params = {
        TableName: TABLE_NAME,
        AttributeDefinitions: [
          { AttributeName: "userId", AttributeType: "S" },
          { AttributeName: "questionId", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" },
          { AttributeName: "questionId", KeyType: "RANGE" },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      };

      await dynamoDBClient.createTable(params).promise();
      console.log(`Table '${TABLE_NAME}' is being created...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log(`Table '${TABLE_NAME}' created and ready.`);
    } else {
      console.log(`Table '${TABLE_NAME}' already exists.`);
    }
  } catch (error) {
    console.error("Error ensuring table exists:", error);
    throw error;
  }
};

// Upload Recording to S3 & Save Metadata to DynamoDB
const uploadRecording = async ({ audioFile, userId, questionId, questionText }) => {
  if (!audioFile || !userId || !questionId || !questionText) {
    throw new Error("Audio file, userId, questionId, and questionText are required.");
  }

  await ensureTableExists();

  const fileName = `${userId}_${Date.now()}_${questionId}.mp3`;

  try {
    // Upload to S3
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: audioFile.buffer,
      ContentType: "audio/mp3",
    };

    const s3Response = await s3.upload(s3Params).promise();
    const recordingUrl = s3Response.Location;

    // Save to DynamoDB
    const dynamoParams = {
      TableName: TABLE_NAME,
      Item: {
        userId,
        questionId,
        recordingUrl,
        questionText,
        timestamp: new Date().toISOString(),
      },
    };

    await dynamoDB.put(dynamoParams).promise();

    return { recordingUrl };
  } catch (error) {
    console.error("Error in uploadRecording:", error);
    throw new Error(`Failed to process recording: ${error.message}`);
  }
};

// Correct Default Export to Avoid Import Issues
export default { uploadRecording };
