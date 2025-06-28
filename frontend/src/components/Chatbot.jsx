import React, { useState, useRef, useEffect } from "react";
import { fetchProducts, fetchChatHistory, saveChatMessage } from "../services/api.js";
import ProductCard from "./ProductCard";
import "../styles/Chatbot.css";

const getTimeStamp = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Chatbot = () => {
  const [messages, setMessages] = useState(() => {
    try {
        const saved = localStorage.getItem("chat_messages");
        const parsed = saved ? JSON.parse(saved) : null;
        return Array.isArray(parsed) && parsed.length > 0
        ? parsed
        : [{ sender: "bot", text: "Hi! What are you looking for today?", timestamp: getTimeStamp() }];
    } catch (e) {
        return [{ sender: "bot", text: "Hi! What are you looking for today?", timestamp: getTimeStamp() }];
    }
    });

  const [input, setInput] = useState("");
  const [products, setProducts] = useState([]);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  // Load chat history from backend on first load
  useEffect(() => {
    const loadChat = async () => {
        if (!token) {
        const saved = localStorage.getItem("chat_messages");
        setMessages(
            saved
            ? JSON.parse(saved)
            : [{ sender: "bot", text: "Hi! What are you looking for today?", timestamp: getTimeStamp() }]
        );
        return;
        }

        try {
        const res = await fetchChatHistory(token);
        if (res.data.length > 0) {
            setMessages(res.data);
        } else {
            setMessages([
            { sender: "bot", text: "Hi! What are you looking for today?", timestamp: getTimeStamp() },
            ]);
        }
        } catch (err) {
        console.error("Failed to load chat history:", err.response?.data || err.message);
        setMessages([
            { sender: "bot", text: "Hi! What are you looking for today?", timestamp: getTimeStamp() },
        ]);
        }
    };

    loadChat();
    }, [token]);


  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMsg = { sender: "user", text: trimmedInput, timestamp: getTimeStamp() };
    const botMsg = { sender: "bot", text: "", timestamp: getTimeStamp() };

    const updateState = (newMsg) => {
        setMessages((prev) => {
        const updated = [...prev, newMsg];
        if (!token) localStorage.setItem("chat_messages", JSON.stringify(updated));
        return updated;
        });
    };

    updateState(userMsg);
    if (token) await saveChatMessage(userMsg, token);

    // Determine category
    let category = "";
    const lower = trimmedInput.toLowerCase();
    if (lower.includes("book")) category = "books";
    else if (lower.includes("electronic")) category = "electronics";
    else if (lower.includes("textile")) category = "textiles";
    else if (lower.includes("furniture")) category = "furnitures";

    try {
        const res = await fetchProducts(trimmedInput, category);
        const found = res.data.results;

        botMsg.text = found.length > 0
        ? `Here are some ${category || "related"} products I found:`
        : "Sorry, I couldn't find anything for that.";

        updateState(botMsg);
        if (token) await saveChatMessage(botMsg, token);
        setProducts(found);
    } catch (err) {
        console.error("Product fetch failed:", err.response?.data || err.message);
        botMsg.text = "Something went wrong fetching products.";
        updateState(botMsg);
        if (token) await saveChatMessage(botMsg, token);
    }

    setInput("");
    };


  const handleReset = () => {
    const resetMsg = {
      sender: "bot",
      text: "Hi! What are you looking for today?",
      timestamp: getTimeStamp(),
    };

    setMessages([resetMsg]);
    setProducts([]);

    if (token) {
      // Optional: clear backend messages route if you create one
    } else {
      localStorage.removeItem("chat_messages");
    }
  };

  return (
    <>
      <div className="chat-container">
        <div className="chat-header">
          <h2>Sales Chatbot</h2>
          <button onClick={handleReset} className="reset-btn">Reset</button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              <div className={`bubble ${msg.sender}`}>
                <div>{msg.text}</div>
                <div className="timestamp">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your request..."
          />
          <button type="submit">Send</button>
        </form>
      </div>

      {products.length > 0 && (
        <div className="product-results">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
};

export default Chatbot;
