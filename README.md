# E-commerce Platform Documentation
## Project Overview
This project is a full-stack e-commerce platform featuring product browsing, a shopping cart, user authentication, and a chatbot for assistance. It's built using React for the frontend and Flask for the backend, with JWT for authentication.

**Key Features:**
*   **Product Browsing:** Users can browse products, filter by category, and search by keywords.
*   **Shopping Cart:** Users can add products to a cart and complete purchases.
*   **User Authentication:** Secure user registration and login using JWT.
*   **Chatbot:** An AI-powered chatbot assists users with product discovery and support.
*   **Purchase History:** Logged-in users can view their past purchases.
**Requirements:**
*   Node.js and npm (for the frontend)
*   Python and pip (for the backend)
*   A database (configured via environment variables)
## Getting Started
### Backend Installation and Setup
1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd backend
    ```
    
2.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Linux/macOS
    venv\Scripts\activate  # On Windows
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    # Assuming you have a requirements.txt file. If not, install dependencies manually:
    pip install flask flask_cors flask_sqlalchemy flask_jwt_extended python-dotenv Werkzeug
    ```
4.  **Configure environment variables:**
    Create a `.env` file in the `backend` directory with the following variables:
        JWT_SECRET_KEY=<your_secret_key>
    DATABASE_URL=<your_database_url>

    e.g., postgresql://user:password@host:port/database
    ```
    If you don't have a database set up, you can use SQLite for testing:
        DATABASE_URL=sqlite:///database.db
    ```
6.  **Initialize the database:**
    ```bash
    python app.py
    # This will create the database tables if they don't exist.
    ```
7.  **(Optional) Seed the database:**
    ```bash
    python seed_data.py
    # This will populate the database with sample products.
    ```
### Frontend Installation and Setup
1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
### Running the Application
1.  **Start the backend server:**
    ```bash
    cd backend
    python app.py
    # The server will run on http://127.0.0.1:5000/
    ```
2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm start
    # The app will run on http://localhost:3000
    ```
## Code Structure
### Backend (`backend/`)
*   `app.py`: Main application file, initializes Flask, database, and registers routes.
*   `models.py`: Defines the database models (Product, User, ChatHistory, PurchaseHistory).
*   `routes/`: Contains the route handlers for different functionalities.
    *   `auth_routes.py`: Handles user authentication (registration, login, profile).
    *   `chat_routes.py`: Handles chat history retrieval and message saving.
    *   `product_routes.py`: Handles product search and retrieval.
    *   `purchase_routes.py`: Handles purchase creation and history retrieval.
*   `seed_data.py`: Seeds the database with initial product data.
### Frontend (`frontend/`)
*   `public/`: Contains static assets like `index.html`, `manifest.json`, and `robots.txt`.
*   `src/`: Contains the React application source code.
    *   `components/`: Contains React components.
        *   `Cart.jsx`: Displays the shopping cart and handles purchases.
        *   `CartContext.jsx`: Provides the cart context for managing cart state.
        *   `Chatbot.jsx`: Implements the chatbot interface and logic.
        *   `Login.jsx`: Implements the login form.
        *   `ProductCard.jsx`: Displays a single product card.
        *   `Register.jsx`: Implements the registration form.
    *   `services/`: Contains API service functions.
        *   `api.js`: Defines functions for making API requests to the backend.
    *   `styles/`: Contains CSS files for styling the components.
    *   `App.js`: Main application component, defines routes and layout.
## API Documentation
The backend provides the following API endpoints:
### Authentication (`/api/auth`)
*   **`POST /api/auth/register`**: Registers a new user.
    *   **Input:**
        ```json
        {
            "username": "newuser",
            "password": "password123"
        }
        ```
    *   **Output (Success):**
        ```json
        {
            "msg": "User registered successfully"
        }
        ```
    *   **Output (Error):**
        ```json
        {
            "msg": "Username already exists"
        }
        ```
*   **`POST /api/auth/login`**: Logs in an existing user.
    *   **Input:**
        ```json
        {
            "username": "existinguser",
            "password": "password123"
        }
        ```
    *   **Output (Success):**
        ```json
        {
            "access_token": "<jwt_token>"
        }
        ```
    *   **Output (Error):**
        ```json
        {
            "msg": "Invalid username or password"
        }
        ```
*   **`GET /api/auth/profile`**: Retrieves the user profile (requires JWT).
    *   **Input:** `Authorization: Bearer <jwt_token>` header
    *   **Output:**
        ```json
        {
            "id": 1,
            "username": "existinguser"
        }
        ```
### Products (`/api/products`)
*   **`GET /api/products`**: Searches for products based on query and category.
    *   **Input:** Query parameters `query` (optional) and `category` (optional).
    *   **Example:** `/api/products?query=book&category=Books`
    *   **Output:**
        ```json
        {
            "results": [
                {
                    "id": 1,
                    "name": "Product 1",
                    "category": "Books",
                    "price": 25.00,
                    "description": "This is a description of Product 1.",
                    "image_url": "https://picsum.photos/200?random=1"
                },
                ...
            ]
        }
        ```
### Chat (`/api/chat-history`)
*   **`GET /api/chat-history`**: Retrieves chat history for the logged-in user (requires JWT).
    *   **Input:** `Authorization: Bearer <jwt_token>` header
    *   **Output:**
        ```json
        [
            {
                "sender": "user",
                "text": "Hello",
                "timestamp": "10:00 AM"
            },
            {
                "sender": "bot",
                "text": "Hi! How can I help you?",
                "timestamp": "10:01 AM"
            }
        ]
        ```
*   **`POST /api/chat-history`**: Saves a chat message (requires JWT).
    *   **Input:** `Authorization: Bearer <jwt_token>` header, request body:
        ```json
        {
            "sender": "user",
            "text": "I'm looking for books",
            "timestamp": "10:02 AM"
        }
        ```
    *   **Output:**
        ```json
        {
            "status": "saved"
        }
        ```
### Purchase (`/api/purchase`)
*   **`POST /api/purchase`**: Makes a purchase (requires JWT).
    *   **Input:** `Authorization: Bearer <jwt_token>` header, request body:
        ```json
        {
            "items": [
                {
                    "id": 1,
                    "name": "Product 1",
                    "category": "Books",
                    "price": 25.00,
                    "description": "This is a description of Product 1.",
                    "image_url": "https://picsum.photos/200?random=1"
                }
            ]
        }
        ```
    *   **Output:**
        ```json
        {
            "message": "Purchase successful!"
        }
        ```
*   **`GET /api/purchase-history`**: Retrieves purchase history for the logged-in user (requires JWT).
    *   **Input:** `Authorization: Bearer <jwt_token>` header
    *   **Output:**
        ```json
        [
            {
                "timestamp": "2024-01-01 12:00:00",
                "items": [
                    {
                        "id": 1,
                        "name": "Product 1",
                        "category": "Books",
                        "price": 25.00,
                        "description": "This is a description of Product 1.",
                        "image_url": "https://picsum.photos/200?random=1"
                    }
                ]
            }
        ]
        ```

