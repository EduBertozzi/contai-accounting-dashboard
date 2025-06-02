# ContAI Accounting Dashboard

A modern, full-stack accounting dashboard for registering and visualizing financial entries, built for ContAI.  
Easily manage, analyze, and audit your company's finances with monthly summaries, validations, and a clean UI.

---

## 🚀 Features

- Register, edit, and delete credit/debit entries
- Monthly summary and totals
- Data validation and user feedback
- Responsive design and dark mode
- Backend: Node.js, TypeScript, Express, PostgreSQL, TypeORM
- Frontend: React and Material UI

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
# Edit your .env with your database credentials
npm run dev
Frontend
bash
cd client
npm install
npm start
⚙️ Environment Variables
Create a file named .env inside the server/ folder with the following content:

text
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=contai_accounting
📁 Folder Structure
text
contai-accounting-dashboard/
│
├── client/      # React frontend
├── server/      # Node.js backend
├── .gitignore
├── README.md
└── LICENSE
📄 License
This project is licensed under the MIT License.

text

---

**Dicas:**
- Sempre use blocos de código (```
- Não misture texto solto após comandos.
- Separe seções com linhas (`---`) para clareza.
- Use listas para tópicos e instruções.

Assim seu README ficará bonito e profissional, como nos melhores projetos do GitHub[2][3][5][7][8].
