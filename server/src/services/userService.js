import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {s3, dynamoDB,AWS,dynamoDBClient} from '../config/awsConfig.js';

const TABLE_NAME = 'Users';

// Function to check if the DynamoDB table exists, and create it if not
const ensureUsersTableExists = async () => {
  try {
    const tables = await dynamoDBClient.listTables().promise();
    if (!tables.TableNames.includes(TABLE_NAME)) {
      console.log(`Creating table: ${TABLE_NAME}`);

      const params = {
        TableName: TABLE_NAME,
        KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }], // Primary key (email)
        AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }], // 'S' = String
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      };

      await dynamoDBClient.createTable(params).promise();
      console.log(`Table '${TABLE_NAME}' created successfully.`);
    } else {
      console.log(`Table '${TABLE_NAME}' already exists.`);
    }
  } catch (error) {
    console.error('Error ensuring table exists:', error);
    throw error;
  }
};

const registerUser = async (name, email, password) => {
  await ensureUsersTableExists(); // Ensure table is ready

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  const params = {
    TableName: TABLE_NAME,
    Item: { userId, name, email, passwordHash },
  };

  await dynamoDB.put(params).promise();
  return { userId, name, email };
};

const loginUser = async (email, password) => {
  await ensureUsersTableExists(); // Ensure table is ready

  const params = {
    TableName: TABLE_NAME,
    Key: { email }, // Query by primary key
  };

  const { Item } = await dynamoDB.get(params).promise();
  if (!Item || !(await bcrypt.compare(password, Item.passwordHash))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: Item.userId }, process.env.JWT_SECRET, {
    expiresIn: '0.05h',
  });

  return { token, userId: Item.userId };
};

export default { registerUser, loginUser };