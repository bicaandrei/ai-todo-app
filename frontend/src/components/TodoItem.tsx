import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Checkbox,
    Box,
    Chip
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Todo } from '../types/todo';

interface TodoItemProps {
    todo: Todo;
    onDelete: (id: number) => void;
    onEdit: (todo: Todo) => void;
    onStatusChange: (id: number, status: 'pending' | 'completed') => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
    todo,
    onDelete,
    onEdit,
    onStatusChange
}) => {
    return (
        <Card sx={{ mb: 2, backgroundColor: todo.status === 'completed' ? '#f5f5f5' : 'white' }}>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" flex={1}>
                        <Checkbox
                            checked={todo.status === 'completed'}
                            onChange={() => onStatusChange(
                                todo.id,
                                todo.status === 'completed' ? 'pending' : 'completed'
                            )}
                        />
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    textDecoration: todo.status === 'completed' ? 'line-through' : 'none'
                                }}
                            >
                                {todo.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {todo.description}
                            </Typography>
                            {todo.due_date && (
                                <Chip
                                    label={`Due: ${format(new Date(todo.due_date), 'MMM d, yyyy')}`}
                                    size="small"
                                    color={new Date(todo.due_date) < new Date() ? 'error' : 'default'}
                                    sx={{ mt: 1 }}
                                />
                            )}
                        </Box>
                    </Box>
                    <Box>
                        <IconButton onClick={() => onEdit(todo)} size="small">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => onDelete(todo.id)} size="small" color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}; 