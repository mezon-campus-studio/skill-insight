import { pool } from '../config/database';

export interface User {
  user_id?: number;
  full_name: string;
  email: string;
  password: string;
  role?: 'admin' | 'teacher' | 'student';
  status?: number;
  created_at?: Date;
  updated_at?: Date;
}

// ================= GET ALL =================
export const findAll = async (): Promise<User[]> => {
  const [rows] = await pool.execute(
    'SELECT user_id, full_name, email, role, status, created_at FROM users'
  );
  return rows as User[];
};

// ================= GET BY ID =================
export const findById = async (id: number): Promise<User | null> => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE user_id = ?',
    [id]
  );
  const result = rows as User[];
  return result.length > 0 ? result[0] : null;
};

// ================= GET BY EMAIL =================
export const findByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  const result = rows as User[];
  return result.length > 0 ? result[0] : null;
};

// ================= CHECK EMAIL EXISTS =================
export const isEmailExists = async (email: string): Promise<boolean> => {
  const [rows] = await pool.execute(
    'SELECT user_id FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  const result = rows as User[];
  return result.length > 0;
};

// ================= CREATE USER =================
export const create = async (userData: User): Promise<number> => {
  const { full_name, email, password, role = 'student' } = userData;

  const [result]: any = await pool.execute(
    `INSERT INTO users (full_name, email, password, role, status) 
     VALUES (?, ?, ?, ?, 1)`,

    [full_name, email, password, role]
  );

  return result.insertId;
};

// ================= GET SAFE USER (KHÔNG PASSWORD) =================
export const findSafeById = async (id: number) => {
  const [rows] = await pool.execute(
    `SELECT user_id, full_name, email, role, status, created_at 
     FROM users WHERE user_id = ?`,
    [id]
  );

  const result = rows as User[];
  return result.length > 0 ? result[0] : null;
};