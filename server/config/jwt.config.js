const jwt = require('jsonwebtoken');
const Token = require('../models/token.model');
require('dotenv').config()

// Secret keys for signing tokens
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (user) => {
    return jwt.sign({
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }, ACCESS_TOKEN_SECRET,
        { expiresIn: '5h' }
    );
};

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign({
        userId: user._id,
    }, REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' });
    return refreshToken;
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw new Error('Invalid access token');
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
};

const revokeRefreshToken = async (token) => {
    await Token.findOneAndDelete({ refreshToken: token });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    revokeRefreshToken
};
