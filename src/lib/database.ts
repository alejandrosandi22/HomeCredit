import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  username: process.env.DB_USERNAME || 'HomeCreditAdmin',
  password: process.env.DB_PASSWORD || 'Admin123!@#$',
  database: process.env.DB_NAME || 'HomeCreditDB',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/entities/**/*.{ts,js}'],
  migrations: ['src/migrations/**/*.{ts,js}'],
  subscribers: ['src/subscribers/**/*.{ts,js}'],
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      console.log('🔌 Initializing database connection...');

      if (
        !process.env.DB_HOST ||
        !process.env.DB_USERNAME ||
        !process.env.DB_PASSWORD ||
        !process.env.DB_NAME
      ) {
        throw new Error('Missing required database environment variables');
      }

      await AppDataSource.initialize();
      console.log('✅ Database connection initialized successfully');

      const result = await AppDataSource.query('SELECT 1 as test');
      console.log('✅ Database connection test passed:', result);
    } else {
      console.log('✅ Database already initialized');
    }
    return AppDataSource;
  } catch (error) {
    console.error('❌ Error initializing database:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
