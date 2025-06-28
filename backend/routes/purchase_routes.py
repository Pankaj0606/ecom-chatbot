from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, PurchaseHistory, User
import json
from datetime import datetime

purchase_bp = Blueprint('purchase', __name__, url_prefix='/api')

@purchase_bp.route('/purchase', methods=['POST'])
@jwt_required()
def make_purchase():
    user_id = get_jwt_identity()
    data = request.get_json()
    items = json.dumps(data.get('items', []))  # expects list of products

    new_purchase = PurchaseHistory(
        user_id=user_id,
        items=items,
        timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )
    db.session.add(new_purchase)
    db.session.commit()
    return jsonify({"message": "Purchase successful!"}), 201

@purchase_bp.route('/purchase-history', methods=['GET'])
@jwt_required()
def get_purchase_history():
    user_id = get_jwt_identity()
    purchases = PurchaseHistory.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            "timestamp": p.timestamp,
            "items": json.loads(p.items)
        } for p in purchases
    ])
