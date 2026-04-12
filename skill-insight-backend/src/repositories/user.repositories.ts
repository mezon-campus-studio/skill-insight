import { pool } from '../config/database';

interface User {
  user_id?: number;
  full_name: string;
  email: string;
  password: string;
  role?: string;
  created_at?: Date;
}

export const findAll = async (): Promise<User[]> => {
  const [rows] = await pool.execute(
    'SELECT user_id, full_name, email, role, created_at FROM users'
  );
  return rows as User[];
};

export const findById = async (id: number): Promise<User | null> => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [id]);
  const result = rows as User[];
  return result.length > 0 ? result[0] : null;
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  const result = rows as User[];
  return result.length > 0 ? result[0] : null;
};

export const create = async (userData: User): Promise<number> => {
  const { full_name, email, password } = userData;
  const [result] = await pool.execute(
    'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
    [full_name, email, password]
  );
  // mysql2/promise trả về OkPacket khi INSERT
  const insertResult = result as any;
  return insertResult.insertId;
};
