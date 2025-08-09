import { query } from '../config/dbConnect.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded.email;
};

export const sendConnectionRequest = async (req, res) => {
  const email = getUserIdFromToken(req);
  const { target_id } = req.body;

  try {
    const { rows: requesterRows } = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    const requester_id = requesterRows[0].id;

    await db.query(
      'INSERT INTO connections (requester_id, target_id) VALUES ($1, $2)',
      [requester_id, target_id]
    );

    res.status(201).json({ message: 'Connection request sent' });
  } catch (err) {
    console.error('Send connection error:', err);
    res.status(400).json({ message: 'Failed to send connection' });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const email = getUserIdFromToken(req);
  const { requester_id } = req.body;

  try {
    const { rows: userRows } = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    const user_id = userRows[0].id;

    await db.query(
      `UPDATE connections
       SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
       WHERE requester_id = $1 AND target_id = $2`,
      [requester_id, user_id]
    );

    res.json({ message: 'Connection accepted' });
  } catch (err) {
    console.error('Accept connection error:', err);
    res.status(400).json({ message: 'Failed to accept request' });
  }
};

export const getMyConnections = async (req, res) => {
  const email = getUserIdFromToken(req);

  try {
    const { rows: userRows } = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    const user_id = userRows[0].id;

    const { rows } = await query(
      `SELECT u.id, u.username, u.full_name, u.profile_picture
       FROM connections c
       JOIN users u ON (u.id = c.requester_id OR u.id = c.target_id)
       WHERE c.status = 'accepted'
         AND (c.requester_id = $1 OR c.target_id = $1)
         AND u.id != $1`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Fetch connections error:', err);
    res.status(500).json({ message: 'Failed to fetch connections' });
  }
};
