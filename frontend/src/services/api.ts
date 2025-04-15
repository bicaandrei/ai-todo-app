import axios from 'axios';
import { Todo, TodoFormData } from '../types/todo';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    response => {
        console.log('API Response:', response);
        return response;
    },
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const api = {
    getTodos: async (): Promise<Todo[]> => {
        try {
            console.log('Fetching todos from:', API_BASE_URL);
            const response = await axiosInstance.get('/todos');
            return response.data;
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    },

    createTodo: async (todo: TodoFormData): Promise<Todo> => {
        try {
            const response = await axiosInstance.post('/todos', todo);
            return response.data;
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    },

    updateTodo: async (id: number, todo: Partial<TodoFormData>): Promise<Todo> => {
        try {
            const response = await axiosInstance.put(`/todos/${id}`, todo);
            return response.data;
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    },

    deleteTodo: async (id: number): Promise<void> => {
        try {
            await axiosInstance.delete(`/todos/${id}`);
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    },

    chat: async (message: string): Promise<{ message: string; command?: any }> => {
        try {
            const response = await axiosInstance.post('/chat', { message });
            return response.data;
        } catch (error) {
            console.error('Error sending chat message:', error);
            throw error;
        }
    }
}; 