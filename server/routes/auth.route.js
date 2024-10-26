const express = require('express');
const { createUser, login, verifyUser, resendVerification, forgotPassword, resetPassword, checkResetPasswordToken, resendForgotPassword, refreshToken, getMe, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', createUser);
authRouter.post('/verify-account', verifyUser);
authRouter.post('/resend-verification', resendVerification);
authRouter.post('/forgot-password', forgotPassword);
authRouter.get('/reset-password/:token/:email', checkResetPasswordToken);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/resend-reset-password', resendForgotPassword);
authRouter.post('/refresh', authMiddleware, refreshToken);
authRouter.get('/me', authMiddleware, getMe);
authRouter.post('/logout', authMiddleware, logout);

module.exports = authRouter;
