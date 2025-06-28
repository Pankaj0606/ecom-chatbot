# routes/chat_routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ChatHistory, User

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat-history', methods=['GET'])
@jwt_required()
def get_chat_history():
    user_id = get_jwt_identity()
    chats = ChatHistory.query.filter_by(user_id=user_id).all()
    result = [
        {
            "sender": c.sender,
            "text": c.message,
            "timestamp": c.timestamp
        } for c in chats
    ]
    return jsonify(result)

@chat_bp.route('/api/chat-history', methods=['POST'])
@jwt_required()
def save_chat_message():
    data = request.json
    user_id = get_jwt_identity()

    new_msg = ChatHistory(
        user_id=user_id,
        sender=data['sender'],
        message=data['text'],
        timestamp=data['timestamp']
    )
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({"status": "saved"}), 201
