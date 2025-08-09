
import { Router } from 'express';
import multer from 'multer';
import { createJob, getAppliedJobs, listJob, getJobById, matchJobsFromResume, applyToJob  } from '../controllers/job.controller.js';

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/create', createJob);
router.get('/applied', getAppliedJobs);
router.get('/list', listJob);
router.get('/:id', getJobById)
router.post('/match', upload.single('resume'), matchJobsFromResume);
// router.post('/search', searchJobsByKeywords);
router.post('/:id/apply', applyToJob);

export default router;