// src/models/user.model.js
import db from '../config/dbConnect.js';

// Get user by wallet
export const getUserByWallet = async (wallet_address) => {
  const { rows } = await db.query(
    'SELECT * FROM users WHERE wallet_address = $1',
    [wallet_address]
  );
  return rows[0] || null;
};

// Update user profile
export const updateUserProfile = async (wallet_address, data) => {
  const {
    full_name,
    email,
    location,
    address,
    bio,
    skills,
    profile_picture,
    linkedin,
    twitter,
    github,
    resume_url,
  } = data;

  await db.query(
    `
    UPDATE users
    SET
      full_name = $1,
      email = $2,
      location = $3,
      address = $4,
      bio = $5,
      skills = $6,
      profile_picture = $7,
      linkedin = $8,
      twitter = $9,
      github = $10,
      resume_url = $11,
      updated_at = CURRENT_TIMESTAMP
    WHERE wallet_address = $12
    `,
    [
      full_name,
      email,
      location,
      address,
      bio,
      skills,
      profile_picture,
      linkedin,
      twitter,
      github,
      resume_url,
      wallet_address,
    ]
  );

  return true;
};
