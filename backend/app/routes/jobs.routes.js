import { Router } from 'express';
import { createJob, listJob, getJobById } from '../controllers/job.controller.js';


const router = Router();

router.post('/create', createJob);
router.get('/list', listJob);
router.get('/:id', getJobById)

export default router;