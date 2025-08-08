import { Router } from 'express';
import { createJob, listJob, getJobById, matchJobsFromResume, applyToJob  } from '../controllers/job.controller.js';


const router = Router();

router.post('/create', createJob);
router.get('/list', listJob);
router.get('/:id', getJobById)
router.post('/match', matchJobsFromResume);
router.post('/:id/apply', applyToJob);

export default router;