import React from "react";
import { useCart } from "./CartContext";
import axios from "axios";

const Cart = () => {
  const { cart, clearCart } = useCart();
  const token = localStorage.getItem("token");

  const handlePurchase = async () => {
    if (!token) return alert("Please login to make a purchase.");

    try {
      await axios.post("http://localhost:5000/api/purchase", {
        items: cart
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Purchase successful!");
      clearCart();
    } catch (err) {
      alert("Purchase failed.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛒 Your Cart</h2>
      {cart.length === 0 ? <p>No items in cart.</p> : (
        <>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>{item.name} - ₹{item.price}</li>
            ))}
          </ul>
          <button onClick={handlePurchase}>Complete Purchase</button>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
};

export default Cart;
