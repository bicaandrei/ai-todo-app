import React, { useState } from 'react';
import {
    Paper,
    TextField,
    IconButton,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface Message {
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export const ChatBox: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = React.useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            text: input,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // TODO: Implement AI response logic here
        // For now, we'll just echo back
        setTimeout(() => {
            const aiMessage: Message = {
                text: `I received your message: "${input}"`,
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
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
                flexDirection: 'column'
            }}
            elevation={3}
        >
            <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
                <Typography variant="h6">AI Assistant</Typography>
            </Box>
            <List
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}
            >
                {messages.map((message, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            flexDirection: 'column',
                            alignItems: message.isUser ? 'flex-end' : 'flex-start',
                            padding: 0
                        }}
                    >
                        <Paper
                            sx={{
                                p: 1,
                                backgroundColor: message.isUser ? 'primary.main' : 'grey.100',
                                color: message.isUser ? 'white' : 'text.primary',
                                maxWidth: '80%'
                            }}
                        >
                            <ListItemText
                                primary={message.text}
                                secondary={message.timestamp.toLocaleTimeString()}
                                secondaryTypographyProps={{
                                    color: message.isUser ? 'white' : undefined,
                                    fontSize: '0.75rem'
                                }}
                            />
                        </Paper>
                    </ListItem>
                ))}
                <div ref={messagesEndRef} />
            </List>
            <Divider />
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={4}
                />
                <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim()}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
}; 