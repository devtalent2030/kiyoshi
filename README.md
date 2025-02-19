### **📜 README.md - Kiyoshi Database System**  

```markdown
# 🍣 Kiyoshi Database System

![GitHub repo size](https://img.shields.io/github/repo-size/devtalent2030/kiyoshi)
![GitHub last commit](https://img.shields.io/github/last-commit/devtalent2030/kiyoshi)
![GitHub issues](https://img.shields.io/github/issues/devtalent2030/kiyoshi)

## 📌 Project Overview  

Kiyoshi is a **full-stack inventory and ordering system** for a sushi restaurant, built using **React (frontend), Node.js/Express (backend), and MySQL (database)**. The system allows customers to browse the menu, place orders, and track them in real-time, while restaurant staff can manage inventory, orders, and customer information.  

This project is structured as **two main applications**:
1. 🖥️ **Frontend (`kiyoshi-app/`)** - A React-based web application for customers and staff.
2. 🖥️ **Backend (`kiyoshi-server/`)** - A Node.js/Express API handling authentication, orders, and inventory management.

---

## 🚀 Features

### 🔹 **Customer Features**
✅ Browse the sushi menu with images  
✅ Place orders and track their status  
✅ Mark favorite menu items for easy access  
✅ Secure account registration and login  

### 🔹 **Admin Features**
✅ View and manage all customer orders  
✅ Add/update menu items and pricing  
✅ Track inventory in real-time  
✅ Assign orders to kitchen staff  

### 🔹 **Technical Features**
✅ REST API with **JWT Authentication**  
✅ Secure **MySQL database** with optimized queries  
✅ Full **CRUD operations** for menu, orders, and inventory  
✅ **Role-based access control** (Customer vs. Admin)  
✅ **Real-time order tracking** using WebSockets  

---

## 🏗️ Tech Stack

| **Technology**  | **Usage**  |
|-----------------|------------|
| **React.js**  | Frontend (User Interface)  |
| **Node.js & Express.js**  | Backend (API & Authentication)  |
| **MySQL**  | Database (Stores orders, users, menu, and inventory)  |
| **Sequelize ORM**  | Database interaction & migrations  |
| **JWT & Bcrypt**  | Authentication & Password Security  |
| **Axios**  | API calls between frontend and backend  |
| **Docker (optional)**  | Containerized Deployment  |

---

## ⚡ Installation & Setup  

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/devtalent2030/kiyoshi.git
cd kiyoshi-database
```

### 2️⃣ **Backend Setup (`kiyoshi-server/`)**  
#### Install dependencies:
```bash
cd kiyoshi-server
npm install
```
#### Configure `.env` (Create and add the following values)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin1718
DB_NAME=kiyoshi_db
PORT=4000
JWT_SECRET=your_secret_key
```
#### Run the backend server:
```bash
npm start
```

---

### 3️⃣ **Frontend Setup (`kiyoshi-app/`)**  
#### Install dependencies:
```bash
cd ../kiyoshi-app
npm install
```
#### Start the frontend:
```bash
npm start
```
The app will be available at: `http://localhost:3000/`

---
```md
## MySQL Setup & Troubleshooting

### Starting MySQL
To start the MySQL server, use the following command:

```sh
sudo /usr/local/mysql/support-files/mysql.server start
```

If successful, you should see:

```sh
Starting MySQL
SUCCESS!
```

### Logging Into MySQL
Once MySQL is running, log in using:

```sh
mysql -u root -p
```

Enter your MySQL root password when prompted.

If successful, you should see:

```sh
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.40 MySQL Community Server - GPL
```

---

## Fixing MySQL Startup Issues
If MySQL fails to start due to an improperly stopped instance, follow these steps:

### 1️⃣ Remove the MySQL PID File  
Run this command to delete any stale PID files:

```sh
sudo rm -f /usr/local/mysql/data/*.pid
```

### 2️⃣ Restart MySQL  
Now, restart MySQL with:

```sh
sudo /usr/local/mysql/support-files/mysql.server start
```

Check its status:

```sh
sudo /usr/local/mysql/support-files/mysql.server status
```

Expected output:

```sh
SUCCESS! MySQL running (PID)
```

---

### 3️⃣ Verify Database Connection  
If MySQL starts successfully, log in and check if your database is accessible:

```sh
mysql -u root -p
```

Once inside MySQL, run:

```sql
SHOW DATABASES;
USE kiyoshi_db;
SHOW TABLES;
```

This ensures that your `kiyoshi_db` database is present and accessible.

---

✅ **You're all set!** If you encounter further issues, ensure MySQL is installed correctly and that the `mysqld` service is running.
```


## 📂 Folder Structure  

```
kiyoshi-database/
│── kiyoshi-app/            # Frontend (React)
│   ├── src/
│   ├── public/
│   ├── package.json
│── kiyoshi-server/         # Backend (Node.js/Express)
│   ├── routes/             # API Routes
│   ├── models/             # Database models
│   ├── controllers/        # Business logic
│   ├── middleware/         # Authentication & validation
│   ├── package.json
│── migrations/             # Database migrations
│── seeders/                # Sample data for testing
│── .gitignore              # Exclude sensitive files
│── README.md               # Documentation
```

---

## 📝 API Endpoints  

| **Method** | **Endpoint** | **Description** | **Auth Required** |
|-----------|-------------|----------------|----------------|
| **POST** | `/auth/register` | Register a new user | ❌ No |
| **POST** | `/auth/login` | Login and get JWT token | ❌ No |
| **GET** | `/menu` | Fetch all menu items | ❌ No |
| **POST** | `/orders` | Place an order | ✅ Yes |
| **GET** | `/orders/:id` | View order details | ✅ Yes |
| **PUT** | `/orders/:id/status` | Update order status (Admin) | ✅ Yes (Admin) |
| **GET** | `/inventory` | View stock levels | ✅ Yes (Admin) |

---

## 🛠️ Future Enhancements  
🔹 **Payment integration (Stripe, PayPal, etc.)**  
🔹 **Mobile app version using React Native**  
🔹 **AI-based menu recommendations**  
🔹 **Dark mode UI theme**  

---

## 🤝 Contribution  

We welcome contributions! Follow these steps:  
1. **Fork the repository**  
2. Create a new branch: `git checkout -b feature-branch`  
3. Make your changes and commit: `git commit -m "Your changes"`  
4. Push to your fork and submit a Pull Request  

---

## 🏆 Credits  

- **Developer:** [Talent Nyota & Conner Cullity](https://github.com/devtalent2030)  
- **Inspiration:** Sushi ordering and inventory management system  

---

## 📜 License  

This project is licensed under the **MIT License** - you are free to modify and distribute it with attribution.  

---

### ⭐ **If you find this project useful, give it a star on GitHub!** ⭐
```

---

