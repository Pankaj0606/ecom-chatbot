# routes/product_routes.py
from flask import Blueprint, request, jsonify
from models import Product

product_bp = Blueprint('products', __name__, url_prefix='/api')

@product_bp.route('/products', methods=['GET'])
def search_products():
    query = request.args.get('query', '').lower()
    category = request.args.get('category', '').lower()

    print(f"Query received: '{query}', Category: '{category}'")  # 🔍 Debug line

    products = Product.query.all()
    results = []

    for product in products:
        print(f"Checking product: {product.name}, {product.category}")  # Optional debug
        name = product.name.lower()
        desc = product.description.lower()
        cat = product.category.lower()

        if (any(word in name or word in desc for word in query.split()) or not query) and \
           (category == cat or not category):  # ✅ Exact match here
            results.append({
                'id': product.id,
                'name': product.name,
                'category': product.category,
                'price': product.price,
                'description': product.description,
                'image_url': product.image_url
            })

    print(f"Returning {len(results)} results")
    return jsonify({'results': results})
