const { verifyAccessToken } = require('../config/jwt.config');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies?.refreshToken;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token required' });
    }

    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is required' });
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (accessError) {
        if(accessError.name === 'TokenExpiredError' && refreshToken) {
            try {
                // Verify refresh token
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                // If refresh token is valid, let the refreshToken endpoint handle the token refresh
                return res.status(401).json({ message: 'Access token expired' });
            } catch (refreshError) {
                // Both tokens are expired or invalid, clear cookies
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict'
                });
                return res.status(401).json({ message: 'Both tokens expired, please login again' });
            }
        }

        // If no refresh token or other error
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
