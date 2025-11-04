const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

// Create DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });
const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || "PatientVitals";

// Fetch vitals by patientId (latest first)
async function getVitalsByPatient(patientId) {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "patientId = :pid",
        ExpressionAttributeValues: {
            ":pid": patientId
        }
    };

    const result = await dynamo.send(new QueryCommand(params));

    // Return latest first by reversing
    return result.Items.reverse();
}

// Scan all vitals (optional, for future use)
async function getAllVitals() {
    const result = await dynamo.send(new ScanCommand({ TableName: TABLE_NAME }));
    return result.Items;
}

module.exports = { getVitalsByPatient, getAllVitals };
