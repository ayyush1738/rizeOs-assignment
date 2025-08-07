import { query } from '../config/dbConnect.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

// Extract email from JWT
const getUserEmail = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded.email;
};

export const createJob = async (req, res) => {
  try {
    const email = getUserEmail(req);
    const { rows: userRows } = await query('SELECT id FROM users WHERE email = $1', [email]);
    const user_id = userRows[0]?.id;

    if (!user_id) return res.status(404).json({ message: 'User not found' });

    const { title, description, skills, budget, location } = req.body;

    await query(
      `INSERT INTO jobs (user_id, title, description, skills, budget, location)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_id, title, description, skills, budget, location]
    );

    res.status(201).json({ message: 'Job created successfully' });
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ message: 'Failed to create job' });
  }
};

export const listJob = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT j.*, u.full_name, u.username, u.profile_picture
       FROM jobs j
       JOIN users u ON j.user_id = u.id
       ORDER BY j.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('List job error:', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      `SELECT j.*, u.full_name, u.username, u.profile_picture
       FROM jobs j
       JOIN users u ON j.user_id = u.id
       WHERE j.id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get job by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch job' });
  }
};
