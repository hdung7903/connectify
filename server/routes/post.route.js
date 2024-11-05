const express = require('express');
const postRoute = express.Router();
const { createPost, reactToPost, commentOnPost, replyToComment, sharePost, renderPost, getUser, getPostByUserId, getOwnerPost, getPost, getUserPosts, getMyPosts } = require('../controllers/post.controller');
const { reactToComment } = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');

postRoute.post('/', createPost);
postRoute.post('/react', reactToPost);
postRoute.post('/comment', commentOnPost);
postRoute.post('/comment/react', reactToComment);
postRoute.post('/reply', replyToComment);
postRoute.post('/share', sharePost);
postRoute.get('/home', renderPost);
postRoute.get('/user/:userId', getUser);
postRoute.get('/post-by-id/:postId', getPost)
postRoute.get('/my-posts', authMiddleware, getMyPosts);
postRoute.get('/user/:userId/posts', authMiddleware, getUserPosts);
postRoute.get('/:otherId', getPostByUserId);
postRoute.get('/owner', getOwnerPost);

module.exports = postRoute;
