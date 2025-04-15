import os
import openai
import json
from datetime import datetime

openai.api_key = os.getenv('OPENAI_API_KEY')

class ChatService:
    def __init__(self):
        self.conversation_history = []

    def process_message(self, user_message):

        self.conversation_history.append({"role": "user", "content": user_message})
        
        try:
            system_message = {
                "role": "system",
                "content": """You are a helpful todo assistant. When users want to create, update, or delete todos, 
                respond in natural language but include a JSON command block that specifies the action.
                
                JSON formats:
                Create: {"action": "create", "todo": {"title": "string", "description": "string", "due_date": "ISO-date", "status": "pending"}}
                Update: {"action": "update", "todo_id": number, "updates": {"title?": "string", "description?": "string", "due_date?": "ISO-date", "status?": "string"}}
                Delete: {"action": "delete", "todo_id": number}
                
                Example: If user says "Create a todo for buying groceries tomorrow", respond with natural language and include:
                {"action": "create", "todo": {"title": "Buy groceries", "description": "Get groceries from the store", "due_date": "2024-XX-XX", "status": "pending"}}"""
            }

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[system_message] + self.conversation_history,
                temperature=0.7,
                max_tokens=500
            )

            assistant_message = response['choices'][0]['message']['content']
            self.conversation_history.append({"role": "assistant", "content": assistant_message})

            try:
                json_start = assistant_message.find('{')
                json_end = assistant_message.rfind('}') + 1
                if json_start != -1 and json_end != -1:
                    json_str = assistant_message[json_start:json_end]
                    command = json.loads(json_str)
                else:
                    command = None
            except json.JSONDecodeError:
                command = None

            return {
                "message": assistant_message,
                "command": command
            }

        except Exception as e:
            print(f"Error in process_message: {str(e)}")  # Add debug logging
            return {
                "message": f"I apologize, but I encountered an error: {str(e)}",
                "command": None
            } 