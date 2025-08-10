import {query} from '../config/dbConnect.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded.email;
};

export const createPost = async (req, res) => {
  const email = getUserIdFromToken(req);
  const { content } = req.body;

  const { rows } = await query('SELECT id FROM users WHERE email = $1', [email]);
  const user_id = rows[0].id;

  await query('INSERT INTO posts (user_id, content) VALUES ($1, $2)', [user_id, content]);
  res.status(201).json({ message: 'Post created' });
};

export const getPosts = async (req, res) => {
  const { rows } = await query(`
    SELECT p.id, p.content, p.created_at, u.full_name, u.username, u.profile_picture,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,
      (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comments
    FROM posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `);
  res.json(rows);
};

export const likePost = async (req, res) => {
  const email = getUserIdFromToken(req);
  const post_id = req.params.postId;

  const { rows } = await query('SELECT id FROM users WHERE email = $1', [email]);
  const user_id = rows[0].id;

  const exists = await query(
    'SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2',
    [post_id, user_id]
  );

  if (exists.rows.length > 0) {
    await query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [post_id, user_id]);
    return res.json({ message: 'Unliked post' });
  } else {
    await query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [post_id, user_id]);
    return res.json({ message: 'Liked post' });
  }
};

export const commentOnPost = async (req, res) => {
  const email = getUserIdFromToken(req);
  const post_id = req.params.postId;
  const { comment } = req.body;

  const { rows } = await query('SELECT id FROM users WHERE email = $1', [email]);
  const user_id = rows[0].id;

  await query(
    'INSERT INTO post_comments (post_id, user_id, comment) VALUES ($1, $2, $3)',
    [post_id, user_id, comment]
  );

  res.status(201).json({ message: 'Comment added' });
};

export const getPostComments = async (req, res) => {
  const post_id = req.params.postId;

  const { rows } = await query(`
    SELECT c.comment, c.created_at, u.full_name, u.username, u.profile_picture
    FROM post_comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `, [post_id]);

  res.json(rows);
};
