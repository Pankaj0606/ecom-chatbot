import React from "react";
import { useCart } from "./CartContext";
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p><strong>₹ {product.price}</strong></p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
