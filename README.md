
# Military Asset Management System

A full-stack web application designed to manage military assets efficiently. This system allows administrators to track assets, assignments, purchases, transfers, and audit logs while ensuring secure access and a responsive dashboard experience.

---

## 📚 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API & Configuration](#api--configuration)
- [Dependencies](#dependencies)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

---

## 🧭 Introduction

The Military Asset Management System enables military personnel to track, update, and monitor inventory and expenditures, making logistics more accountable and streamlined. Built with a React frontend and a Node.js/Express backend, it supports authentication, dashboard analytics, asset handling, and audit logs.

---

## 🚀 Features

- Secure user authentication and protected routes
- Dashboard with metrics and recent activity
- Asset CRUD operations and status tracking
- Purchase and expenditure management
- Assignment handling for personnel and assets
- Transfer tracking between locations
- Audit logs for actions and changes
- Modular architecture for scalability
- Vite + React frontend for performance
- RESTful API backend using Express.js

---

## 🗂 Project Structure

```
samswnshi-military_assest_management/
├── client/            # Frontend - React with Vite
└── server/            # Backend - Node.js with Express
```

### Client Highlights (`client/`)
- Pages for Auth, Dashboard, Assets, Assignments, Expenditures, Purchases, Transfers
- Components for Dashboard UI, Layout, Modals
- Context for authentication and protected routes
- Config files: `vite.config.js`, `vercel.json`

### Server Highlights (`server/`)
- Controllers for all major modules
- RESTful routes under `routes/`
- MongoDB models under `models/`
- Middleware for authentication
- Central `index.js` server entry point

---

## ⚙️ Installation

### Prerequisites
- Node.js >= 16.x
- npm or yarn
- MongoDB database (local or cloud)

### Clone the Repository

```bash
git clone https://github.com/yourusername/samswnshi-military_assest_management.git
cd samswnshi-military_assest_management
```

### Setup Client

```bash
cd client
npm install
npm run dev
```

### Setup Server

```bash
cd server
npm install
npm run start
```

> Configure your MongoDB URI and other environment variables inside `server/.env`.

---

## 💻 Usage

1. Register or login using valid credentials.
2. Navigate through the sidebar to manage:
   - Assets
   - Assignments
   - Transfers
   - Purchases and Expenditures
3. Use dashboard widgets for overview metrics.
4. View audit logs to track user activity.

---

## 🔧 API & Configuration

### Backend Base URL

Update client `api.jsx` with your server URL:

```js
const API_BASE = "http://localhost:8080/api"; 
```

### Environment Variables (`server/.env`)
```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
```

---

## 📦 Dependencies

### Client
- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS (assumed from CSS naming conventions)

### Server
- Express
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- CORS

---

## 🧪 Examples

- Create an asset: Navigate to **Assets > New Asset**
- Assign an asset: Go to **Assignments > New Assignment**
- Transfer between units: Use **Transfers > New Transfer**
- Monitor metrics: Check the **Dashboard**

---

## 🛠 Troubleshooting

| Issue                      | Solution                                           |
|---------------------------|----------------------------------------------------|
| Client can't connect to server | Check CORS, API base URL, and server is running |
| MongoDB connection failed | Ensure credentials and URI are correct in `.env`  |
| Protected route access denied | Login and check user role permissions           |

---

## 👨‍💻 Contributors

- **Samswnshi** — Full Stack Developer *(assumed from project name)*
- *You? Submit a PR to join!*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
Feel free to use, modify, and distribute for personal or commercial purposes.

---
