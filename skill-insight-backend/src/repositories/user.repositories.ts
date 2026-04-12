import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Cập nhật interface cho đúng với bảng của bạn
interface UserRow extends RowDataPacket {
  user_id: number;
  full_name: string;
  email: string;
  password?: string;
  role: string;
  created_at: Date;
}
export const findAll = async (): Promise<UserRow[]> => {
  const [rows] = await pool.execute<UserRow[]>(
    'SELECT user_id, full_name, email, role, created_at FROM users'
  );
  return rows;
};
export const findById = async (id: number): Promise<UserRow | null> => {
  const [rows] = await pool.execute<UserRow[]>(
    'SELECT * FROM users WHERE user_id = ?',
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findByEmail = async (email: string): Promise<UserRow | null> => {
  const [rows] = await pool.execute<UserRow[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const create = async (userData: any): Promise<number> => {
  const { full_name, email, password } = userData;
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
    [full_name, email, password]
  );
  return result.insertId;
};