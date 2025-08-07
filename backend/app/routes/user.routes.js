import { Router } from 'express';
import { getMyProfile, updateMyProfile } from "../controllers/user.controller.js";
import { sendConnectionRequest, acceptConnectionRequest, getMyConnections } from '../controllers/network.controller.js';

const router = Router();

router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.post('/request', sendConnectionRequest);
router.post('/network/accept', acceptConnectionRequest);
router.get('/network/myConnections', getMyConnections);

export default router;