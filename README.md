# ContAI Accounting Dashboard

A modern accounting dashboard for registering and visualizing financial entries, built for ContAI.

## Features

- Register, edit, and delete credit/debit entries
- Monthly summary and totals
- Data validation and user feedback
- Responsive design and dark mode
- Backend with Node.js, TypeScript, Express, PostgreSQL, and TypeORM
- Frontend with React and Material UI

## Getting Started

### Backend

cd server
npm install
cp .env.example .env

Edit your .env with your database credentials
npm run dev

text

### Frontend

cd client
npm install
npm start

text

## Environment Variables

Create a file named `.env` inside the `server/` folder with the following content:

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=contai_accounting

text

## Folder Structure

contai-accounting-dashboard/
│
├── client/ # React frontend
├── server/ # Node.js backend
├── .gitignore
├── README.md
└── LICENSE

text

## License

MIT