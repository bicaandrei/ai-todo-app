import React, { useState } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Paper,
    Typography,
    Stack,
    CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { api } from '../services/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatBoxProps {
    onTodoUpdate: () => void;  
}

export const ChatBox: React.FC<ChatBoxProps> = ({ onTodoUpdate }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        try {
            const response = await api.chat(userMessage);
            
            setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);

            if (response.command) {
                onTodoUpdate();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Sorry, I encountered an error processing your request.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 350,
                height: 500,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
            }}
        >
            <Box
                sx={{
                    p: 2,
                    backgroundColor: 'primary.main',
                    color: 'white',
                }}
            >
                <Typography variant="h6">Chat Assistant</Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                {messages.map((message, index) => (
                    <Box
                        key={index}
                        sx={{
                            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                        }}
                    >
                        <Paper
                            sx={{
                                p: 1,
                                backgroundColor: message.role === 'user' ? 'primary.main' : 'grey.100',
                                color: message.role === 'user' ? 'white' : 'text.primary',
                            }}
                        >
                            <Typography variant="body2">{message.content}</Typography>
                        </Paper>
                    </Box>
                ))}
            </Box>

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                />
                <IconButton 
                    color="primary" 
                    onClick={handleSend}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
            </Stack>
        </Paper>
    );
}; 