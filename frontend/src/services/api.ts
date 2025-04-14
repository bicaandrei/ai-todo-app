import axios from 'axios';
import { Todo, TodoFormData } from '../types/todo';

const API_BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000, // 5 seconds timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

export const api = {
    getTodos: async (): Promise<Todo[]> => {
        const response = await axiosInstance.get('/todos');
        return response.data;
    },

    createTodo: async (todo: TodoFormData): Promise<Todo> => {
        const response = await axiosInstance.post('/todos', todo);
        return response.data;
    },

    updateTodo: async (id: number, todo: Partial<TodoFormData>): Promise<Todo> => {
        const response = await axiosInstance.put(`/todos/${id}`, todo);
        return response.data;
    },

    deleteTodo: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/todos/${id}`);
    }
}; 