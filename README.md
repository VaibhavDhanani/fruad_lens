# FruadLens - Fraud Detection Platform

FruadLens is a complete fraud detection platform that includes a FastAPI backend for transaction analysis, a React + Vite frontend for user interactions, an Express server for real-time transaction, and integrated machine learning models for advanced fraud detection.

## 🚀 Project Structure

```
FruadLens/
├── backend/         # FastAPI backend (fraud detection APIs)
├── frontend/        # React + Vite frontend (user interface)
├── server/          # Node + Express server (real-time communication)
├── Dataset/         # Transaction data for training and testing models
└── README.md        # Project documentation
```

## 📦 Prerequisites

* Python 3.11+
* Node.js 18+
* npm 9+ or yarn 1.22+

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/VaibhavDhanani/fruad_lens.git
cd FruadLens
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv  # Create virtual environment
source venv/bin/activate  # Activate venv (Linux/Mac)
# .\venv\Scripts\activate  # Activate venv (Windows)
pip install -r requirements.txt  # Install dependencies
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/ignosis_db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password
```

Run the backend server:

```bash
uvicorn main:app --reload
```

### 3. Frontend Setup (React + Vite)

```bash
cd ../frontend
npm install  # Install dependencies
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

Run the frontend server:

```bash
npm run dev
```

### 4. Server Setup (Express + Node.js)

```bash
cd ../server
npm install  # Install dependencies
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
```

Run the server:

```bash
node server.js
```

### 5. Dataset Setup

Ensure the `Dataset/` directory contains the necessary training and testing data for your models. Update the backend code to point to the correct dataset path if needed.

## 🚦 Running the Full Application

Make sure all three services (backend, frontend, and server) are running simultaneously:

```bash
# In separate terminal windows or tabs:
cd backend && uvicorn main:app --reload
cd frontend && npm run dev
cd server && node server.js
```

## 📂 Folder Structure

```
FruadLens/
├── backend/         # FastAPI APIs for fraud detection
├── frontend/        # React + Vite UI
├── server/          # Node + Express server for real-time events
├── Dataset/         # Training and testing data
└── README.md        # Project documentation
```

## 📚 Documentation

* **Backend (FastAPI):** Swagger UI at `http://localhost:8000/docs`
* **Frontend (React + Vite):** Hosted at `http://ec2-13-127-98-0.ap-south-1.compute.amazonaws.com/`
* **Server (Express):** Running on `http://localhost:5000`

## 📸 Screenshots
### Authentication Page
![image](https://github.com/user-attachments/assets/ae6c6a7c-6ae3-413e-a936-b5476c2bf763)

### User Dashboard
![image](https://github.com/user-attachments/assets/1ad58f7e-fc95-43d6-9f7a-a93fb52657fe)

![image](https://github.com/user-attachments/assets/b0a16308-9207-4f53-ac0b-5087cbd52d72)

### Profile
![image](https://github.com/user-attachments/assets/a702d3b5-ea7b-4244-83e1-066846e45dee)

### Admin Dashboard
![image](https://github.com/user-attachments/assets/09c07752-903b-48fc-94f3-52c5a1745842)

### Multi Model Testing
![image](https://github.com/user-attachments/assets/b94bce28-b72f-4069-b606-8081dab890ad)

![image](https://github.com/user-attachments/assets/798f3e58-d628-4d7d-8e1c-5acbb3142d0b)

### Single Model Testing
![image](https://github.com/user-attachments/assets/987040b4-22b0-43fb-a9b6-d8df232d00ca)

