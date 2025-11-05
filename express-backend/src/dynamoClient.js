// dynamoClient.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

// Initialize AWS DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1", // change if needed
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Document client makes it easier to work with JSON
const dynamo = DynamoDBDocumentClient.from(client);

module.exports = dynamo;
