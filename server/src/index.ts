import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/data-source';
import accountingRouter from './routes/accounting';

// Inicializa a conexão com o banco e inicia o servidor Express
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected!');
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use('/api', accountingRouter);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(error => console.log('❌ Connection error:', error));
