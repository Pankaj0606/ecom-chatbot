// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import { CartProvider } from './components/CartContext';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <CartProvider>
      <Router>
        <nav>
          <Link to="/">Chatbot</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Chatbot token={token} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
