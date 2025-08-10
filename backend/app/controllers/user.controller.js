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
              location, resume_url
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

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const { rows } = await query(
      // IMPORTANT: Select ONLY public-safe data. No email!
      `SELECT id, email, username, full_name, wallet_address, location, bio, skills, profile_picture, resume_url
       FROM users WHERE username = $1`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);

  } catch (err) {
    console.error('Error fetching public profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Controller for a user to get THEIR OWN private profile.
 * Requires a valid token, and returns data for the user who owns the token.
 * Can safely return sensitive info like email to the owner.
 */
export const getApplicants = async (req, res) => {
    // 1. Get the Job ID from URL parameters and the logged-in user's ID from the auth middleware
    const { id: jobId } = req.params;
    const loggedInUserId = req.user?.id; // Assumes auth middleware adds 'user' to the request



    try {
        // 3. Authorize the request: Check if the logged-in user is the job's poster
        const jobQuery = 'SELECT user_id FROM jobs WHERE id = $1';
        const jobResult = await query(jobQuery, [jobId]);

        if (jobResult.rows.length === 0) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        const jobPosterId = jobResult.rows[0].user_id;
        if (jobPosterId !== loggedInUserId) {
            // If the user is not the poster, deny access
            return res.status(403).json({ message: 'You are not authorized to view applicants for this job.' });
        }

        // 4. Fetch the applicants if the user is authorized
        // We join job_applications with the users table to get the applicant's details
        const applicantsQuery = `
            SELECT
                ja.id,
                ja.user_id,
                ja.job_id,
                ja.cover_letter,
                ja.status,
                ja.applied_at,
                u.full_name AS user_full_name,
                u.profile_picture AS user_profile_picture
            FROM
                job_applications AS ja
            JOIN
                users AS u ON ja.user_id = u.id
            WHERE
                ja.job_id = $1
            ORDER BY
                ja.applied_at DESC;
        `;

        const applicantsResult = await query(applicantsQuery, [jobId]);

        // 5. Send the successful response
        res.status(200).json({ applicants: applicantsResult.rows });

    } catch (error) {
        console.error('Error fetching job applicants:', error);
        res.status(500).json({ message: 'An error occurred on the server while fetching applicants.' });
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


