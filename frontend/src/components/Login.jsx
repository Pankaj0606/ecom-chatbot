import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';

const Login = ({ setToken }) => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const token = res.data.access_token;
      localStorage.setItem('token', token);
      setToken(token);
      alert("Login successful!");
    } catch (err) {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
