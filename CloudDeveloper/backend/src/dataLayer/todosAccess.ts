import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess{
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  )
  {}

  async getUserTodos(userId: string): Promise<TodoItem[]>{

  const result = await this.docClient.query({
    TableName : this.todosTable,
    IndexName: this.userIdIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },

    ScanIndexForward: false
  }).promise()

  return result.Items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem>{

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async getTodoById(id: string): Promise<AWS.DynamoDB.QueryOutput>{
    return await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues:{
        ':todoId': id
      }
    }).promise()
  }

  async updateTodo(updatedTodo:UpdateTodoRequest,todoId:string){

    const updateTodoParams = {
      TableName: this.todosTable,
      Key: { "todoId": todoId },
      UpdateExpression: "set #n = :a, dueDate = :b, done = :c",
      ExpressionAttributeValues:{
        ":a": updatedTodo['name'],
        ":b": updatedTodo.dueDate,
        ":c": updatedTodo.done
      },
      ExpressionAttributeNames:{
        "#n": "name"
      },
      ReturnValues:"UPDATED_NEW"
    }

    return await this.docClient.update(updateTodoParams).promise()
  }

  async deleteTodoById(todoId: string){
    const param = {
      TableName: this.todosTable,
      Key:{
        "todoId":todoId
      }
    }

    await this.docClient.delete(param).promise()
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}