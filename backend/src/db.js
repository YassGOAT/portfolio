import 'dotenv/config';
import mysql from 'mysql2/promise';

const required = ['MYSQL_HOST','MYSQL_PORT','MYSQL_USER','MYSQL_PASSWORD','MYSQL_DB'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('❌ Missing DB env vars:', missing.join(', '));
  throw new Error('Database environment not fully configured');
}

console.log('🔗 MySQL host =', process.env.MYSQL_HOST);

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  ssl: process.env.MYSQL_CA
    ? { ca: process.env.MYSQL_CA }         // ✅ on lit le CA depuis l’ENV
    : { rejectUnauthorized: true }         // fallback (marche chez certains providers)
});
