const AWS = require('../config/aws');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient();

const uploadJD = async (userId, jdText) => {
  const jdId = uuidv4();
  const params = {
    Bucket: 'your-jd-bucket',
    Key: `${userId}/${jdId}.txt`,
    Body: jdText,
  };

  await s3.upload(params).promise();

  await docClient.put({
    TableName: 'JobDescriptions',
    Item: { jdId, userId, jdText },
  }).promise();

  return { jdId, jdText };
};

module.exports = { uploadJD };
