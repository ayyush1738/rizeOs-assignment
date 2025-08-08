import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { query } from '../config/dbConnect.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const getMyProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { rows } = await query(
      `SELECT id, email, username, full_name, bio, profile_picture, skills,
              location, address, resume_url
       FROM users WHERE email = $1`,
      [decoded.email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Token error:', err);
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

export const updateMyProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const {
      full_name,
      wallet_address,
      bio,
      profile_picture,
      skills,
      location,
      address,
      resume_url
    } = req.body;

    await query(
      `UPDATE users
       SET full_name = $1,
           wallet_address = $2,
           bio = $3,
           profile_picture = $4,
           skills = $5,
           location = $6,
           resume_url = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE email = $8`,
      [
        full_name,
        wallet_address,
        bio,
        profile_picture,
        skills, // Expecting skills to be an array if using PostgreSQL TEXT[]
        location,
        resume_url,
        decoded.email
      ]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
