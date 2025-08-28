import { getApiClient, Task } from './api';

export async function fetchTasks(): Promise<Task[]> {
  const client = getApiClient();
  const response = await client.get('/tasks');
  return response.data as Task[];
}

export async function createTask(title: string): Promise<Task> {
  const client = getApiClient();
  const response = await client.post('/tasks', { title });
  return response.data as Task;
}

export async function updateTask(id: Task['id'], updates: Partial<Task>): Promise<Task> {
  const client = getApiClient();
  const response = await client.put(`/tasks/${String(id)}`, updates);
  console.log('Update Task Response:', response.data);
  return response.data as Task;
}

export async function deleteTask(id: string) {
  const client = getApiClient();
  console.log('DELETE request to:', `/tasks/${String(id)}`);
  const response = await client.delete(`/tasks/${String(id)}`);
  console.log('Response after delete:', response.data);
  return response.data;
}
