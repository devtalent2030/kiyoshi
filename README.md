# Kiyoshi Database System
https://img.shields.io/github/repo-size/devtalent2030/kiyoshi
https://img.shields.io/github/last-commit/devtalent2030/kiyoshi
https://img.shields.io/github/issues/devtalent2030/kiyoshi

## Project Overview

Kiyoshi is a full-stack inventory and ordering system for a sushi restaurant built with:
- React (Frontend)
- Node.js / Express (Backend)
- MySQL (Database)

The project consists of two main applications:
1. kiyoshi-app/ – React frontend
2. kiyoshi-server/ – Express backend API

The system allows customers to browse menu items, place orders, and track them, while administrators manage inventory, menu items, and order workflows.

---

## Features

### Customer Features
- Browse sushi items with images
- Place orders and track status
- Mark favorite items
- Register/login securely

### Admin Features
- Manage orders
- Create/edit menu items
- Real-time inventory tracking
- Assign orders to kitchen staff

### Technical Features
- REST API with JWT auth
- Secure MySQL database
- CRUD for menu, orders, inventory
- Role-based access control
- Real-time updates via WebSockets

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React.js | Frontend |
| Node.js + Express | Backend API |
| MySQL | Database |
| Sequelize ORM | Models & migrations |
| JWT + Bcrypt | Authentication |
| Axios | API requests |
| Docker | Deployment |

---

##  Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/devtalent2030/kiyoshi.git
cd kiyoshi-database
```

---

## 2️⃣ Backend Setup (kiyoshi-server/)

### Install dependencies
```bash
cd kiyoshi-server
npm install
```

### Create .env
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin1718
DB_NAME=kiyoshi_db
PORT=4000
JWT_SECRET=your_secret_key
```

### Start backend
```bash
npm start
```

---

## 3️⃣ Frontend Setup (kiyoshi-app/)

### Install dependencies
```bash
cd ../kiyoshi-app
npm install
```

### Start frontend
```bash
npm start
```

App at: http://localhost:3000/

---

# MySQL Setup & Troubleshooting

## Start MySQL
```sh
sudo /usr/local/mysql/support-files/mysql.server start
```

## Login
```sh
mysql -u root -p
```

---

## Fix MySQL Startup Issues

### Remove stale PID
```sh
sudo rm -f /usr/local/mysql/data/*.pid
```

### Restart
```sh
sudo /usr/local/mysql/support-files/mysql.server start
```

### Verify
```sql
SHOW DATABASES;
USE kiyoshi_db;
SHOW TABLES;
```

---

# Folder Structure
```
kiyoshi-database/
│── kiyoshi-app/
│   ├── src/
│   ├── public/
│   ├── package.json
│
│── kiyoshi-server/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── package.json
│
│── migrations/
│── seeders/
│── .gitignore
│── README.md
```

---

#  API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|-------|
| POST | /auth/register | Register user | No |
| POST | /auth/login | Login | No |
| GET | /menu | Get menu | No |
| POST | /orders | Create order | Yes |
| GET | /orders/:id | Get order | Yes |
| PUT | /orders/:id/status | Update status | Admin |
| GET | /inventory | Inventory | Admin |

---

# 🛠️ Future Enhancements
- Payment integration
- Mobile version
- AI recommendations
- Dark mode

---

#  Credits
Talent Nyota & Conner Cullity

---

#  License
MIT License
