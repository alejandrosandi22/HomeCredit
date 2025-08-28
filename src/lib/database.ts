import sql, { ConnectionPool } from 'mssql';

let pool: ConnectionPool | null = null;

export async function getConnection() {
  if (pool) return pool;

  try {
    pool = await sql.connect({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      server: process.env.DB_SERVER ?? 'localhost',
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    return pool;
  } catch (err) {
    console.error('Error conectando a SQL Server:', err);
    throw err;
  }
}
