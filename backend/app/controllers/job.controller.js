import { query } from '../config/dbConnect.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import natural from 'natural';
import pdfjs from 'pdfjs-dist/legacy/build/pdf.js';
const { getDocument } = pdfjs;


// Prevent pdfjs-dist from requiring `canvas`
global.DOMMatrix = global.DOMMatrix || function () {};

const JWT_SECRET = process.env.JWT_SECRET;

// Extract email from JWT
const getUserEmail = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded.email;
};

const TfIdf = natural.TfIdf;
const MATCHING_API_URL = 'http://localhost:8001/match-jobs';

async function extractPdfText(buffer) {
  const loadingTask = getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    text += pageText + '\n';
  }
  return text;
}

function cosineSimilarity(vecA, vecB) {
  const intersection = Object.keys(vecA).filter(k => vecB[k]);
  let dotProduct = 0, normA = 0, normB = 0;

  intersection.forEach(k => { dotProduct += vecA[k] * vecB[k]; });
  Object.values(vecA).forEach(v => { normA += v * v; });
  Object.values(vecB).forEach(v => { normB += v * v; });

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const createJob = async (req, res) => {
  try {
    const email = getUserEmail(req);
    const { rows: userRows } = await query('SELECT id FROM users WHERE email = $1', [email]);
    const user_id = userRows[0]?.id;

    if (!user_id) return res.status(404).json({ message: 'User not found' });

    const { company_name, title, description, skills, budget, location } = req.body;

    await query(
      `INSERT INTO jobs (user_id, company_name, title, description, skills, budget, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [user_id, company_name, title, description, skills, budget, location]
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

export const matchJobsFromResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    // 1. Extract text from PDF
    const resumeText = await extractPdfText(req.file.buffer);
    if (!resumeText.trim()) {
      return res.json({ matches: [] }); // No text → no matches
    }

    // 2. Fetch jobs from DB
    const { rows: jobs } = await query(`SELECT * FROM jobs`);
    if (jobs.length === 0) {
      return res.json({ matches: [] });
    }

    // 3. Build TF-IDF model
    const tfidf = new TfIdf();
    tfidf.addDocument(resumeText); // doc 0 = resume

    jobs.forEach(job => {
      const jobSkills = Array.isArray(job.skills)
        ? job.skills.join(' ')
        : job.skills || '';
      const jobText = `${job.title} ${job.description || ''} ${jobSkills}`;
      tfidf.addDocument(jobText);
    });

    // 4. Create vector from TF-IDF terms
    const getVector = (docIndex) => {
      const vector = {};
      tfidf.listTerms(docIndex).forEach(term => {
        vector[term.term] = term.tfidf;
      });
      return vector;
    };

    const resumeVector = getVector(0);
    const matches = jobs.map((job, idx) => {
      const jobVector = getVector(idx + 1);
      const score = cosineSimilarity(resumeVector, jobVector);
      return { ...job, score };
    });

    // 5. Sort & filter by similarity
    const threshold = 0.05; // tweak as needed
    const filteredMatches = matches
      .filter(m => m.score >= threshold)
      .sort((a, b) => b.score - a.score);

    // 6. Return results
    return res.json({ matches: filteredMatches });
  } catch (err) {
    console.error('Match jobs error:', err);
    res.status(500).json({ message: 'Failed to match jobs' });
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

export const applyToJob = async (req, res) => {
  try {
    const email = getUserEmail(req);
    const jobId = req.params.id;
    const { cover_letter } = req.body;

    // Get user_id
    const { rows } = await query('SELECT id FROM users WHERE email = $1', [email]);
    const user_id = rows[0]?.id;

    if (!user_id) return res.status(404).json({ message: 'User not found' });

    // Check if already applied
    const existing = await query(
      'SELECT * FROM job_applications WHERE user_id = $1 AND job_id = $2',
      [user_id, jobId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'You already applied to this job' });
    }

    // Insert new application
    await query(
      `INSERT INTO job_applications (user_id, job_id, cover_letter)
       VALUES ($1, $2, $3)`,
      [user_id, jobId, cover_letter]
    );

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Job apply error:', err);
    res.status(500).json({ message: 'Failed to apply to job' });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const email = getUserEmail(req);

    const { rows: userRows } = await query('SELECT id FROM users WHERE email = $1', [email]);
    const user_id = userRows[0]?.id;

    if (!user_id) return res.status(404).json({ message: 'User not found' });

    const { rows } = await query(
      `SELECT job_id FROM job_applications WHERE user_id = $1 ORDER BY applied_at DESC`,
      [user_id]
    );

    // return plain array of ids for simpler client handling
    const applied_job_ids = rows.map(r => parseInt(r.job_id, 10));

    res.json({ applied_job_ids });
  } catch (err) {
    console.error('Get applied jobs error:', err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Failed to fetch applied jobs' });
  }
};
