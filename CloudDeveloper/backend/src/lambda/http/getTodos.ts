import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getTodos } from '../../businessLogic/todos'
import { getUserId } from "../utils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log("Processing Event:", event);

  const userId = getUserId(event)
  const items = await getTodos(userId)

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    },
    body: JSON.stringify({
      items
    })
  }
}
