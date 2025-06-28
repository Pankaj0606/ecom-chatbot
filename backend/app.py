from flask import Flask
from flask_cors import CORS
from routes.product_routes import product_bp
from models import init_db, db
from flask_jwt_extended import JWTManager
from routes.auth_routes import auth_bp
from routes.chat_routes import chat_bp
from routes.purchase_routes import purchase_bp
from dotenv import load_dotenv
import os

# ✅ Load .env variables
load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "fallback-secret")  # fallback is optional
# ✅ (Optional) Use env var for DB too, if desired
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")

CORS(app)
JWTManager(app)

# Initialize and configure DB
init_db(app)

with app.app_context():
    db.create_all()  # Create tables if they don't exist

# Register routes
app.register_blueprint(product_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(purchase_bp)

if __name__ == "__main__":
    app.run(debug=True)
