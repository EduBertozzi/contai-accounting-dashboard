![ContAI Banner](https://imgur.com/9ckOBAN.png)

# ContAI Accounting Dashboard (VERSION - 1.0)

A modern, full-stack accounting dashboard for registering and visualizing financial entries, built for ContAI.  
Easily manage, analyze, and audit your company's finances with monthly summaries, validations, and a clean UI.

---

## 🚀 Features

- Register, edit, and delete credit/debit entries;
- Monthly summary and totals;
- Data validation and user feedback;
- Responsive design;
- Backend: Node.js, TypeScript, Express, PostgreSQL, TypeORM;
- Frontend: React and Material UI.

---

## 📚 Table of Contents

- [Features](#-features)
- [Getting Started](#-getting-started)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Variables](#️-environment-variables)
- [Folder Structure](#-folder-structure)
- [License](#-license)

---

## 🏁 Getting Started

### Backend

```bash
cd server
npm install
cp .env.example .env
```

---

## ⚙️ Environment Variables

Create a file named `.env` inside the `server/` folder with the following content:

```DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=contai_accounting
```

---

## 📁 Folder Structure

```
contai-accounting-dashboard/
│
├── client/ # React frontend
├── server/ # Node.js backend
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🚀 Front-end Live Demo

[Access the deployed app on Vercel](https://contai-accounting-dashboard-hzkbkdwfs.vercel.app/)

## 🐳 Running the Database with Docker

To start a local PostgreSQL database using Docker, run the following command in the project root (where the `docker-compose.yml` file is located):

```docker-compose up -d```

This will:
- Download the official PostgreSQL image if you don't have it yet;
- Create a container with your database, user, and password as configured;
- Expose the database on `localhost:5432`;
- Persist data in a local Docker volume.

To stop the database, run:

```docker-compose down```

> Make sure your backend `.env` file matches the database credentials set in `docker-compose.yml`.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

Developed with ❤️ by **Eduardo Bertozzi**

[LinkedIn](https://www.linkedin.com/in/eduardo-bertozzi/) &nbsp;|&nbsp; [GitHub](https://github.com/EduBertozzi)

