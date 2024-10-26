const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshToken.model');
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
        { expiresIn: '15m' }
    );
};
    
const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign({
        userId: user._id,
    }, REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' });

    // Save the refresh token in the database
    const tokenDocument = new RefreshToken({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await tokenDocument.save();
    return refreshToken;
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw new Error('Invalid access token');
    }
};

const verifyRefreshToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const refreshToken = await RefreshToken.findOne({
        token,
        userId: decoded.userId,
        isRevoked: false,
        expiresAt: { $gt: new Date() }
    });

    if (!refreshToken) {
        throw new Error('Invalid refresh token');
    }

    return decoded;
};

const revokeRefreshToken = async (token) => {
    await RefreshToken.findOneAndDelete({ token });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    revokeRefreshToken
};
