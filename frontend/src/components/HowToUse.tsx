import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';

interface HowToUseProps {
    open: boolean;
    onClose: () => void;
}

export const HowToUse: React.FC<HowToUseProps> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>How to Use Smart Todo</DialogTitle>
            <DialogContent>
                <Typography variant="body1" paragraph>
                    Smart Todo is an AI-powered todo list application that lets you manage your tasks using natural language through the chat interface or traditional UI controls.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Using the Chat Assistant
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText 
                            primary="Create Tasks"
                            secondary='Try saying "Create a todo for buying groceries tomorrow" or "Add a task to review the project by next week"'
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="Update Tasks"
                            secondary='Try saying "Mark the grocery task as done" or "Change the deadline for the report to next Friday"'
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="Delete Tasks"
                            secondary='Try saying "Delete the grocery task"'
                        />
                    </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Using the Traditional Interface
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText 
                            primary="Add New Tasks"
                            secondary='Click the "Add Todo" button to create a new task with a title, description, and due date'
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="Manage Tasks"
                            secondary="Use the buttons on each task card to edit, delete, or mark tasks as complete"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText 
                            primary="Filter and Search"
                            secondary="Use the status filter and search box to find specific tasks"
                        />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}; 