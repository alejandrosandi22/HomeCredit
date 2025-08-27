import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  username: process.env.DB_USERNAME || 'HomeCreditAdmin',
  password: process.env.DB_PASSWORD || 'Admin123!@#$',
  database: process.env.DB_NAME || 'HomeCreditDB',
  entities: ['src/entities/**/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 600000,
  },
});
