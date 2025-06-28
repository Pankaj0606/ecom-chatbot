// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

export const fetchProducts = (query, category) => 
  API.get('/products', {
    params: {
      query: query || "",        // default to empty string if undefined
      category: category || "",  // avoid sending undefined
    }
  });

export const fetchChatHistory = async (token) => {
  return axios.get('http://localhost:5000/api/chat-history', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const saveChatMessage = async (msg, token) => {
  return axios.post('http://localhost:5000/api/chat-history', msg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
