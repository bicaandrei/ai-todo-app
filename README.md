# AI-Powered Todo List

A modern todo list application that lets you manage your tasks through both a traditional interface and a chat-based AI assistant. Built with React, Flask, and OpenAI's API.

## Features

- Chat with an AI assistant to manage your tasks using natural language
- Traditional UI for direct task management
- Real-time updates and task filtering
- Due date tracking and status management
- Responsive design that works on all devices

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for beautiful components
- Axios for API calls

### Backend
- Flask for the API server
- PostgreSQL for data storage
- OpenAI API for natural language processing

## Getting Started

1. Clone the repository and install dependencies:
```bash
git clone [<repository-url>](https://github.com/bicaandrei/ai-todo-app.git)
cd ai-todo-app
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```
DATABASE_URL=postgresql://postgres:parola123@localhost:5432/postgres
FLASK_APP=app.py
FLASK_ENV=development
OPENAI_API_KEY=your_api_key_here
```

4. Set up the frontend:
```bash
cd ../frontend
npm install
```

5. Create a `.env` file in the frontend directory:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## Running the App

1. Start the backend:
```bash
cd backend
source venv/bin/activate
flask run
```

2. Start the frontend:
```bash
cd frontend
npm start
```

Visit `http://localhost:3000` to start using the app!

## Using the App

### Chat Interface
Try these commands in the chat:
- "Create a todo for buying groceries tomorrow"
- "Mark the grocery task as done"
- "Change the deadline for the report to next Friday"
- "Delete the grocery task"

### Traditional Interface
- Use the "Add Todo" button to create new tasks
- Edit, delete, or mark tasks as complete using the task cards
- Filter tasks by status or search for specific ones

## Development Notes

During development, I implemented a custom `MockChatService` to handle chat interactions when OpenAI API requests were limited. This service provides similar functionality to the OpenAI-powered chat but with predefined responses, making it perfect for development and testing without consuming API credits.

The mock service supports all basic operations (create, update, delete tasks) and can be easily switched with the OpenAI service by changing a single import in the backend code.
