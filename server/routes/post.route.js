const express = require('express');
const router = express.Router();
const { createPost, reactToPost, commentOnPost, replyToComment, sharePost } = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { reactToComment } = require('../controllers/post.controller'); // Đảm bảo hàm được import đúng

router.post('/', authMiddleware, createPost);
router.post('/react', authMiddleware, reactToPost);
router.post('/comment', authMiddleware, commentOnPost);
router.post('/comment/react', authMiddleware, reactToComment);
router.post('/reply', authMiddleware, replyToComment);
router.post('/share', authMiddleware, sharePost);
router.post('/comment/react', authMiddleware, reactToComment);
module.exports = router;
