import json
from datetime import datetime, timedelta

class MockChatService:
    def __init__(self):
        self.conversation_history = []

    def process_message(self, user_message):
        self.conversation_history.append({"role": "user", "content": user_message})
        
        try:
            message_lower = user_message.lower()
            tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            next_week = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")

            if "create" in message_lower or "add" in message_lower:
                title = "New Task"
                if "grocery" in message_lower or "groceries" in message_lower:
                    title = "Buy groceries"
                    description = "Get groceries from the store"
                elif "review" in message_lower:
                    title = "Review Project"
                    description = "Conduct project review"
                else:
                    description = "Task description"

                due_date = tomorrow if "tomorrow" in message_lower else next_week

                response = {
                    "message": f"I'll help you create a todo for {title}. I've set it for {due_date}.",
                    "command": {
                        "action": "create",
                        "todo": {
                            "title": title,
                            "description": description,
                            "due_date": due_date,
                            "status": "pending"
                        }
                    }
                }

            elif "mark" in message_lower and ("done" in message_lower or "complete" in message_lower):
                todo_id = 1 
                if "grocery" in message_lower:
                    response = {
                        "message": "I'll mark the grocery task as completed.",
                        "command": {
                            "action": "update",
                            "todo_id": todo_id,
                            "updates": {
                                "status": "completed"
                            }
                        }
                    }
                else:
                    response = {
                        "message": "Please specify which task you'd like to mark as completed.",
                        "command": None
                    }

            elif "delete" in message_lower:
                todo_id = 1 
                response = {
                    "message": "I'll delete that todo for you.",
                    "command": {
                        "action": "delete",
                        "todo_id": todo_id
                    }
                }

            elif "change" in message_lower or "update" in message_lower:
                todo_id = 1  
                updates = {}
                
                if "deadline" in message_lower or "due" in message_lower:
                    if "tomorrow" in message_lower:
                        updates["due_date"] = tomorrow
                    elif "next week" in message_lower:
                        updates["due_date"] = next_week
                
                if updates:
                    response = {
                        "message": f"I'll update the todo with the new details.",
                        "command": {
                            "action": "update",
                            "todo_id": todo_id,
                            "updates": updates
                        }
                    }
                else:
                    response = {
                        "message": "I'm not sure what you want to update. Could you be more specific?",
                        "command": None
                    }

            else:
                response = {
                    "message": "I can help you manage your todos. Try saying things like:\n- Create a todo for buying groceries tomorrow\n- Mark the grocery task as done\n- Change the deadline for a task\n- Delete a task",
                    "command": None
                }

            self.conversation_history.append({"role": "assistant", "content": response["message"]})
            return response

        except Exception as e:
            print(f"Error in mock process_message: {str(e)}")
            return {
                "message": f"I apologize, but I encountered an error: {str(e)}",
                "command": None
            } 