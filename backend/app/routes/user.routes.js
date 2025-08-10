import { Router } from 'express';
import { getMyProfile, getUserProfile, updateMyProfile } from "../controllers/user.controller.js";

const router = Router();

router.get('/profile/:username', getUserProfile)
router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);

export default router;