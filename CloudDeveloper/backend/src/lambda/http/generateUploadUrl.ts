import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import 'source-map-support/register'


const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})
const bucketName = process.env.S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const todostable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  console.log("Processing Event:", event);

  const imageId = uuid.v4()
  const url = getUploadUrl(imageId)
  const imageUrl = await updateImageUrl(todoId, imageId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      imageUrl: imageUrl,
      uploadUrl: url
    })
  }
}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })
}

async function updateImageUrl(todoId: string, imageId: string) {

  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

  const updateUrlOnTodo = {
    TableName: todostable,
    Key: { "todoId": todoId },
    UpdateExpression: "set attachmentUrl = :a",
    ExpressionAttributeValues:{
      ":a": imageUrl
    },
    ReturnValues:"UPDATED_NEW"
  }

  await docClient
    .update(updateUrlOnTodo)
    .promise()

  return imageUrl
}