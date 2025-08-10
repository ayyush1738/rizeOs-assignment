
import { Router } from 'express';
import multer from 'multer';
import { createJob, getAppliedJobs, listJob, getJobById, matchJobsFromResume, applyToJob, getApplicants  } from '../controllers/job.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/create', createJob);
router.get('/applied', authMiddleware, getAppliedJobs);
router.get('/list', listJob);
router.get('/:id/applicants', authMiddleware, getApplicants);
router.get('/:id', getJobById)
router.post('/match', upload.single('resume'), matchJobsFromResume);
router.post('/:id/apply', applyToJob);


export default router;