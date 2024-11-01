const express = require('express');
const postRoute = express.Router();
const { createPost, reactToPost, commentOnPost, replyToComment, sharePost, renderPost, getUser } = require('../controllers/post.controller');
const { reactToComment } = require('../controllers/post.controller');

postRoute.post('/', createPost);
postRoute.post('/react', reactToPost);
postRoute.post('/comment', commentOnPost);
postRoute.post('/comment/react', reactToComment);
postRoute.post('/reply', replyToComment);
postRoute.post('/share', sharePost);
postRoute.get('/home', renderPost);
postRoute.get('/user/:userId', getUser);

module.exports = postRoute;
