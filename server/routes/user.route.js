const express = require('express');
const userRouter = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getUser } = require('../controllers/user.controller');

userRouter.get('/:userId', getUser);

module.exports = userRouter;