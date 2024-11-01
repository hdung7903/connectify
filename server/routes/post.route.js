const express = require('express');
const postRoute = express.Router();
const { createPost, reactToPost, commentOnPost, replyToComment, sharePost, renderPost, getUser } = require('../controllers/post.controller');
const { reactToComment } = require('../controllers/post.controller');
const { getMyPosts, getUserPosts } = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');

postRoute.post('/', createPost);
postRoute.post('/react', reactToPost);
postRoute.post('/comment', commentOnPost);
postRoute.post('/comment/react', reactToComment);
postRoute.post('/reply', replyToComment);
postRoute.post('/share', sharePost);
postRoute.get('/home', renderPost);
postRoute.get('/user/:userId', getUser);
// Route lấy bài viết của người dùng hiện tại
postRoute.get('/my-posts', authMiddleware, getMyPosts);
// Route ấy bài viết của người dùng khác
postRoute.get('/user/:userId/posts', authMiddleware, getUserPosts);
module.exports = postRoute;
