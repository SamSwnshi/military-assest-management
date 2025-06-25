# Military Asset Management System - Documentation

## 1. Project Overview

The Military Asset Management System is a comprehensive, web-based platform designed to track and manage military assets, including vehicles, weapons, equipment, and ammunition. It provides a centralized system for inventory control, asset transfers, purchases, expenditures, and user assignments, ensuring accountability and operational readiness.

### Key Features:
- **Dashboard:** At-a-glance overview of key metrics, including total assets, net movement, and recent activity.
- **Asset Tracking:** Detailed records of each asset, including type, quantity, status, and location.
- **Role-Based Access Control (RBAC):**  Different user roles (Admin, Base Commander, Logistics Officer) with specific permissions.
- **Asset Lifecycle Management:** Track assets from purchase and transfer to expenditure and assignment.
- **Audit Logging:** Comprehensive logging of all significant user actions for security and accountability.

### Assumptions & Limitations:
- **Assumptions:**
  - Users are authenticated and have defined roles.
  - Assets are tracked at the base level.
  - A stable internet connection is available for accessing the system.
- **Limitations:**
  - The system does not currently support real-time GPS tracking of assets.
  - Offline functionality is not available.
  - The current version is designed for internal use and does not integrate with external logistics systems.

---

## 2. Tech Stack & Architecture

The system is built on the MERN stack (MongoDB, Express, React, Node.js), chosen for its flexibility, scalability, and robust ecosystem.

### Tech Stack:
- **Frontend:** React with Vite for a fast development experience, Tailwind CSS for styling, and React Hook Form for form management.
- **Backend:** Node.js with Express for building the RESTful API.
- **Database:** MongoDB (with Mongoose) for its flexible, schema-less nature, which is well-suited for a variety of asset types and data structures.
- **Authentication:** JSON Web Tokens (JWT) for secure, stateless authentication between the frontend and backend.

### Architecture:
The system follows a classic client-server architecture:
- **Client (Frontend):** A single-page application (SPA) built with React that communicates with the backend via REST API calls.
- **Server (Backend):** An Express.js application that handles business logic, database operations, and user authentication.
- **Database:** A MongoDB database that stores all data, including users, assets, transfers, and audit logs.

---

## 3. Data Models

The system uses several MongoDB collections to store data:

### `users`
- **Purpose:** Stores user information, roles, and credentials.
- **Structure:**
  ```json
  {
    "_id": "ObjectId",
    "username": "String",
    "email": "String",
    "password": "String (hashed)",
    "role": "String ('Admin', 'BaseCommander', 'LogisticsOfficer')",
    "baseId": "ObjectId (ref: 'bases')",
    "lastLogin": "Date"
  }
  ```

### `assets`
- **Purpose:** Stores detailed information about each asset.
- **Structure:**
  ```json
  {
    "_id": "ObjectId",
    "assetId": "String (unique)",
    "name": "String",
    "type": "String ('vehicle', 'weapon', ...)",
    "quantity": "Number",
    "baseId": "ObjectId (ref: 'bases')",
    "status": "String ('available', 'assigned', ...)",
    "unitPrice": "Number"
  }
  ```

### `transfers`
- **Purpose:** Tracks the movement of assets between bases.
- **Structure:**
  ```json
  {
    "_id": "ObjectId",
    "assetId": "ObjectId (ref: 'assets')",
    "fromBaseId": "ObjectId (ref: 'bases')",
    "toBaseId": "ObjectId (ref: 'bases')",
    "quantity": "Number",
    "status": "String ('pending', 'completed', 'cancelled')",
    "transferredBy": "ObjectId (ref: 'users')"
  }
  ```

### `purchases` & `expenditures`
- **Purpose:** Track the acquisition and consumption of assets.
- **Structure:** Similar to `transfers`, with relevant fields for each action.

### `auditlogs`
- **Purpose:** Logs all significant user actions.
- **Structure:**
  ```json
  {
    "_id": "ObjectId",
    "userId": "ObjectId (ref: 'users')",
    "action": "String ('CREATE', 'UPDATE', 'LOGIN', ...)",
    "resourceType": "String ('ASSET', 'PURCHASE', ...)",
    "resourceId": "ObjectId",
    "details": "String",
    "userAgent": "String"
  }
  ```

---

## 4. Role-Based Access Control (RBAC)

RBAC is enforced using middleware on the backend and conditional rendering on the frontend.

### Roles:
- **Admin:** Full access to all system features, including user management, base creation, and system-wide asset tracking.
- **Base Commander:** Full access to all data and actions within their assigned base. Can approve transfers and manage assets for their base.
- **Logistics Officer:** Can create and manage asset records, transfers, purchases, and expenditures within their assigned base.

### Examples:
- An **Admin** can create a new user and assign them to a base.
- A **Base Commander** can approve a pending transfer request for their base.
- A **Logistics Officer** can create a new asset record for their base.
- A **Logistics Officer** cannot approve transfers or manage users.

---

## 5. Audit Logging

The system logs all significant actions to the `auditlogs` collection for security and accountability.

### What Gets Logged:
- **User Actions:** Login, logout, profile updates.
- **Asset Management:** Create, update, delete assets.
- **Transfers:** Creation and status updates (approved, completed, etc.).
- **Purchases & Expenditures:** Creation and updates.
- **User Management:** User creation, updates, and deletions by admins.

### Where to View:
- The **Audit Logs** page in the application provides a filterable, paginated view of all audit log entries.

---

## 6. Setup Instructions

Follow these steps to set up and run the project locally:

### Prerequisites:
- Node.js (v18 or later)
- MongoDB (local or cloud instance)

### 1. Clone the Repository:
```sh
git clone https://github.com/your-repo/military-asset-management.git
cd military-asset-management
```

### 2. Configure Environment Variables:
- Create a `.env` file in the `server` directory and add the following:
  ```
  PORT=8080
  MONGO_URL=your-mongodb-connection-string
  JWT_SECRET=your-jwt-secret
  FRONTEND_URL=http://localhost:5173
  ```

### 3. Install Dependencies & Run Backend:
```sh
cd server
npm install
npm start
```
The server will be running on `http://localhost:8080`.

### 4. Install Dependencies & Run Frontend:
```sh
cd ../client
npm install
npm run dev
```
The frontend will be running on `http://localhost:5173`.

---

## 7. API Samples

Here are some examples of API requests you can make to the backend:

### **Create a Purchase:**
- **Endpoint:** `POST /api/purchases/create`
- **Auth:** Required (JWT)
- **Body:**
  ```json
  {
    "assetId": "60f7c0b8e1d2c8a1b8e1d2c8",
    "baseId": "60f7c0a7e1d2c8a1b8e1d2c7",
    "quantity": 50,
    "unitPrice": 1200
  }
  ```

### **Get Dashboard Metrics:**
- **Endpoint:** `GET /api/dashboard/metrics`
- **Auth:** Required (JWT)
- **Query Params (Optional):** `baseId`, `dateRange`

### **Create an Asset Transfer:**
- **Endpoint:** `POST /api/transfers/create`
- **Auth:** Required (JWT)
- **Body:**
  ```json
  {
    "assetId": "60f7c0b8e1d2c8a1b8e1d2c8",
    "fromBaseId": "60f7c0a7e1d2c8a1b8e1d2c7",
    "toBaseId": "60f7c0c3e1d2c8a1b8e1d2c9",
    "quantity": 10,
    "notes": "Transfer for training exercise"
  }
  ``` 