# seed_data.py
from models import db, Product, User, init_db

from flask import Flask
import random

app = Flask(__name__)
init_db(app)

with app.app_context():
    db.drop_all()
    db.create_all()

    categories = ["Electronics", "Books", "Textiles"]
    for i in range(1, 101):
        product = Product(
            name=f"Product {i}",
            category=random.choice(categories),
            price=round(random.uniform(10.0, 999.99), 2),
            description=f"This is a description of Product {i}.",
            image_url= f'https://picsum.photos/200?random={i}'
        )
        db.session.add(product)
    db.session.commit()
    print("Database seeded with 100 products.")
