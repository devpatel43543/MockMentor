const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const AWS = require('../config/aws');

const docClient = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB();
const TABLE_NAME = 'Users';

// Function to check if the DynamoDB table exists, and create it if not
const ensureUsersTableExists = async () => {
  try {
    const tables = await dynamodb.listTables().promise();
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

      await dynamodb.createTable(params).promise();
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

  await docClient.put(params).promise();
  return { userId, name, email };
};

const loginUser = async (email, password) => {
  await ensureUsersTableExists(); // Ensure table is ready

  const params = {
    TableName: TABLE_NAME,
    Key: { email }, // Query by primary key
  };

  const { Item } = await docClient.get(params).promise();
  if (!Item || !(await bcrypt.compare(password, Item.passwordHash))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: Item.userId }, process.env.JWT_SECRET, {
    expiresIn: '72h',
  });

  return { token, userId: Item.userId };
};

module.exports = { registerUser, loginUser };
