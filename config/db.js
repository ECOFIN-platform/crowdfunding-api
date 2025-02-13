const AWS = require("aws-sdk");
require("dotenv").config();

// Configuration AWS
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const PROJECTS_TABLE = process.env.PROJECTS_TABLE;

module.exports = { dynamoDB, PROJECTS_TABLE };
