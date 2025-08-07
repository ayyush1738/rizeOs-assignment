import { Router } from 'express';
import { createPost, likePost, commentOnPost, getPostComments } from '../controllers/feed.controller.js';

const router = Router();

router.put('/post', createPost);
router.post('/:postId/like', likePost);
router.post('/:postId/comment', commentOnPost);
router.get('/:postId/comments', getPostComments);
// router.post('/:postId/share', sharePost);

export default router;
