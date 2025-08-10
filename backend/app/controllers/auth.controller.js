import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { query } from '../config/dbConnect.js';
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const { rows } = await query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    const insertResult = await query(
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *',
      [email, username, password]
    );

    const user = insertResult.rows[0];
    const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, {
      expiresIn: '6h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
      maxAge: 6 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user;

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Failed to register user' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);

    const user = rows[0];

    if (!user || user.password !== password) {
      return res.status(403).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, {
      expiresIn: '6h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
      maxAge: 6 * 60 * 60 * 1000,
    });
    const { password: _, ...safeUser } = user;

    res.json({
      message: 'Login successful',
      token,
      user: safeUser, 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};