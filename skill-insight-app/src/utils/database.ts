import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Thay bằng user MySQL của bạn
  password: '123456', // Thay bằng password của bạn
  database: 'learnit',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;