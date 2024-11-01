const { verifyAccessToken, verifyRefreshToken, generateAccessToken } = require('../config/jwt.config');
const Token = require('../models/token.model');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access token required' });
        }

        const accessToken = authHeader.split(' ')[1];

        try {
            // First try to verify the access token
            const decoded = verifyAccessToken(accessToken);
            req.user = decoded;
            return next();
        } catch (error) {
            // If access token is expired, try to use refresh token
            if (error.name === 'TokenExpiredError') {
                // Find the token document using the expired access token
                const tokenDoc = await Token.findOne({ accessToken });
                
                if (!tokenDoc) {
                    return res.status(401).json({ message: 'Token not found' });
                }

                try {
                    // Verify the refresh token
                    const decoded = verifyRefreshToken(tokenDoc.refreshToken);
                    
                    // Generate new access token
                    const newAccessToken = generateAccessToken({ _id: decoded.userId });
                    
                    // Update token document with new access token
                    tokenDoc.accessToken = newAccessToken;
                    tokenDoc.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                    await tokenDoc.save();

                    res.setHeader('New-Access-Token', newAccessToken);
                    req.user = decoded;
                    return next();
                } catch (refreshError) {
                    return res.status(401).json({ message: 'Invalid refresh token' });
                }
            }
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authMiddleware;
