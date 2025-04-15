import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    TextField,
    MenuItem,
    Stack
} from '@mui/material';
import { Add as AddIcon, Help as HelpIcon } from '@mui/icons-material';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { ChatBox } from './ChatBox';
import { HowToUse } from './HowToUse';
import { api } from '../services/api';
import { Todo, TodoFormData } from '../types/todo';

export const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTodos = useCallback(async () => {
        try {
            const data = await api.getTodos();
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleAddTodo = async (data: TodoFormData) => {
        try {
            await api.createTodo(data);
            fetchTodos();
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    };

    const handleUpdateTodo = async (id: number, data: Partial<TodoFormData>) => {
        try {
            await api.updateTodo(id, data);
            fetchTodos();
            setIsFormOpen(false);
            setEditingTodo(undefined);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleDeleteTodo = async (id: number) => {
        try {
            await api.deleteTodo(id);
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const filteredTodos = todos
        .filter(todo => statusFilter === 'all' || todo.status === statusFilter)
        .filter(todo =>
            todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack spacing={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" component="h1">
                        Smart Todo
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<HelpIcon />}
                            onClick={() => setIsHowToUseOpen(true)}
                        >
                            How to Use
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setEditingTodo(undefined);
                                setIsFormOpen(true);
                            }}
                        >
                            Add Todo
                        </Button>
                    </Stack>
                </Box>

                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Search"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        select
                        label="Status"
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        sx={{ width: 150 }}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </TextField>
                </Stack>

                {filteredTodos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onDelete={handleDeleteTodo}
                        onEdit={(todo) => {
                            setEditingTodo(todo);
                            setIsFormOpen(true);
                        }}
                        onStatusChange={(id, status) => handleUpdateTodo(id, { status })}
                    />
                ))}
            </Stack>

            <TodoForm
                open={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingTodo(undefined);
                }}
                onSubmit={(data) => {
                    if (editingTodo) {
                        handleUpdateTodo(editingTodo.id, data);
                    } else {
                        handleAddTodo(data);
                    }
                }}
                initialData={editingTodo}
            />

            <HowToUse 
                open={isHowToUseOpen}
                onClose={() => setIsHowToUseOpen(false)}
            />

            <ChatBox onTodoUpdate={fetchTodos} />
        </Container>
    );
}; 