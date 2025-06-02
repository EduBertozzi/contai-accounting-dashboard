# ContAI Accounting Dashboard

A modern, full-stack accounting dashboard for registering and visualizing financial entries, built for ContAI.  
Easily manage, analyze, and audit your company's finances with monthly summaries, validations, and a clean UI.

---

## 🚀 Features

- 📥 Register, edit, and delete credit/debit entries
- 📊 Monthly summary and totals
- ✅ Data validation and user feedback
- 🌙 Responsive design and dark mode
- 🛠️ Backend: Node.js, TypeScript, Express, PostgreSQL, TypeORM
- 💻 Frontend: React and Material UI

---

## 📚 Table of Contents

- [Features](#-features)
- [Getting Started](#-getting-started)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [License](#license)

---

## 🏁 Getting Started

### Backend

cd server
npm install
cp .env.example .env

Edit your .env with your database credentials
npm run dev


### Frontend

cd client
npm install
npm start

---

## ⚙️ Environment Variables

Create a file named `.env` inside the `server/` folder with the following content:

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=contai_accounting

---

## 📁 Folder Structure

contai-accounting-dashboard/
│
├── client/ # React frontend
├── server/ # Node.js backend
├── .gitignore
├── README.md
└── LICENSE

---

## 📄 License

This project is licensed under the MIT License.

---

## 📄 License
