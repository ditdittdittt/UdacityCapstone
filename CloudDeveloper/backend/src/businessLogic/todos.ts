import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const todoAccess = new TodosAccess()

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getUserTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const todoId = uuid.v4()

  const newItem = {
    todoId: todoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  }
  return await todoAccess.createTodo(newItem)
}

export async function updateToDo(todoId: string, updatedTodo: UpdateTodoRequest){

  return await todoAccess.updateTodo(updatedTodo, todoId)
}

export async function deleteToDo(todoId: string) {
  return await todoAccess.deleteTodoById(todoId)
}