import { v4 as uuidv4 } from "uuid";
import { s3, dynamoDB,dynamoDBClient } from "../config/awsConfig.js";
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const TABLE_NAME = "JDRecords";

const ensureTableExists = async () => {
  try {
    const tables = await dynamoDBClient.listTables().promise(); 
    if (!tables.TableNames.includes(TABLE_NAME)) {
      console.log(`Creating table: ${TABLE_NAME}`);

      const params = {
        TableName: TABLE_NAME,
        AttributeDefinitions: [
          { AttributeName: "userId", AttributeType: "S" },
          { AttributeName: "jdId", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" },
          { AttributeName: "jdId", KeyType: "RANGE" },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      };

      await dynamoDBClient.createTable(params).promise(); // Use base client
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

const jdService = async (file, userId) => {
  if (!file || !userId) throw new Error("File and userId are required.");

  await ensureTableExists();

  const jdId = uuidv4();
  const s3Key = `jds/${userId}/${jdId}.txt`;

  try {
    // Upload file to S3
    await s3
      .upload({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: file.buffer,
        ContentType: "text/plain",
      })
      .promise();

    const s3Url = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

    await dynamoDB
      .put({
        TableName: TABLE_NAME,
        Item: {
          userId,
          jdId,
          s3Url,
          uploadedAt: new Date().toISOString(),
        },
      })
      .promise();

    return { jdId, s3Url };
  } catch (error) {
    console.error("Error in jdService:", error);
    throw new Error(`Failed to process JD: ${error.message}`);
  }
};

export default jdService;