import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AccountingEntry } from '../entities/AccountingEntry';

// Configuração da conexão com o banco de dados PostgreSQL via TypeORM
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [AccountingEntry],
  synchronize: true, // Apenas para desenvolvimento! Não use em produção.
  logging: false,
});
