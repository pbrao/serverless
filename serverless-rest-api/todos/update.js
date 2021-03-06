'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    if (typeof data.myText !== 'string' || typeof data.checked !== 'boolean' ){
        console.error('Validation error');
        callback(new Error('Validation failed. Could not update the item'));
        return;
    }
    const params = {
        Key: {
            "id": event.pathParameters.id
        },
        TableName: "todos",
        UpdateExpression: 'SET myText = :newMyText, checked = :newChecked, updatedAt = :newTimestamp',
        ExpressionAttributeValues: {
            ':newMyText': data.myText,
            ':newChecked': data.checked,
            ':newTimestamp': timestamp 
        }
    }

    dynamoDb.update(params, (error, result) =>{
        if (error){
            console.error(error);
            callback(new Error('Could not update the item'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item)
        }

        callback(null, response);
    })
}