import { Router } from 'express';
import { createJob, listJob, getJobById, matchJobsFromResume  } from '../controllers/job.controller.js';


const router = Router();

router.post('/create', createJob);
router.get('/list', listJob);
router.get('/:id', getJobById)
router.post('/match', upload.single('resume'), matchJobsFromResume);

export default router;