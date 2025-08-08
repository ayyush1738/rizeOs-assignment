import { Router } from 'express';
import { createPost, getPosts, likePost, commentOnPost, getPostComments } from '../controllers/feed.controller.js';

const router = Router();

router.post('/post', createPost);
router.get('/timeline', getPosts);
router.post('/:postId/like', likePost);
router.post('/:postId/comment', commentOnPost);
router.get('/:postId/comments', getPostComments);
// router.post('/:postId/share', sharePost);

export default router;
