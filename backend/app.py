from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import os
from dotenv import load_dotenv
import logging
from chat_service import ChatService

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],  
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

chat_service = ChatService()

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:parola123@localhost:5432/postgres')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    due_date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

@app.route('/api/todos', methods=['GET'])
def get_todos():
    try:
        logger.debug("Received GET request for todos")
        todos = Todo.query.all()
        logger.debug(f"Found {len(todos)} todos")
        return jsonify([{
            'id': todo.id,
            'title': todo.title,
            'description': todo.description,
            'status': todo.status,
            'due_date': todo.due_date.isoformat() if todo.due_date else None,
            'user_id': todo.user_id
        } for todo in todos])
    except Exception as e:
        logger.error(f"Error in get_todos: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/todos', methods=['POST'])
def create_todo():
    data = request.json
    new_todo = Todo(
        title=data['title'],
        description=data.get('description'),
        status=data.get('status', 'pending'),
        due_date=datetime.fromisoformat(data['due_date']) if 'due_date' in data else None,
        user_id=data.get('user_id')
    )
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({
        'id': new_todo.id,
        'title': new_todo.title,
        'description': new_todo.description,
        'status': new_todo.status,
        'due_date': new_todo.due_date.isoformat() if new_todo.due_date else None,
        'user_id': new_todo.user_id
    }), 201

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    data = request.json
    
    todo.title = data.get('title', todo.title)
    todo.description = data.get('description', todo.description)
    todo.status = data.get('status', todo.status)
    todo.due_date = datetime.fromisoformat(data['due_date']) if 'due_date' in data else todo.due_date
    
    db.session.commit()
    return jsonify({
        'id': todo.id,
        'title': todo.title,
        'description': todo.description,
        'status': todo.status,
        'due_date': todo.due_date.isoformat() if todo.due_date else None,
        'user_id': todo.user_id
    })

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    return '', 204

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({"error": "Message is required"}), 400
            
        response = chat_service.process_message(user_message)
        
        if response['command']:
            command = response['command']
            
            try:
                if command['action'] == 'create':
                    todo_data = command['todo']
                    new_todo = Todo(
                        title=todo_data['title'],
                        description=todo_data.get('description'),
                        status=todo_data.get('status', 'pending'),
                        due_date=datetime.fromisoformat(todo_data['due_date']) if 'due_date' in todo_data else None
                    )
                    db.session.add(new_todo)
                    db.session.commit()
                
                elif command['action'] == 'update':
                    todo = Todo.query.get(command['todo_id'])
                    if todo:
                        updates = command['updates']
                        if 'title' in updates:
                            todo.title = updates['title']
                        if 'description' in updates:
                            todo.description = updates['description']
                        if 'status' in updates:
                            todo.status = updates['status']
                        if 'due_date' in updates:
                            todo.due_date = datetime.fromisoformat(updates['due_date'])
                        db.session.commit()
                
                elif command['action'] == 'delete':
                    todo = Todo.query.get(command['todo_id'])
                    if todo:
                        db.session.delete(todo)
                        db.session.commit()
            
            except Exception as e:
                logger.error(f"Error executing command: {str(e)}")
                return jsonify({
                    "message": response['message'],
                    "error": f"Error executing command: {str(e)}"
                }), 500
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000) 