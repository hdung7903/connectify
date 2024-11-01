const socketIO = require('socket.io');
const { verifyAccessToken, generateAccessToken, verifyRefreshToken } = require('./jwt.config');
const Token = require('../models/token.model');
const User = require('../models/user.model');

function initializeSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        },
        pingTimeout: 60000,
        connectTimeout: 45000,
        maxHttpBufferSize: 1e6, // 1 MB
        transports: ['websocket', 'polling']
    });

    // Authentication and connection handling middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            
            if (!token) {
                return next(new Error("Authentication token is required"));
            }

            try {
                // First attempt with access token
                const decoded = verifyAccessToken(token);
                const user = await User.findById(decoded.userId).select('-passwordHash');
                
                if (!user) {
                    return next(new Error("User not found"));
                }

                if (!user.accountVerification.isVerified) {
                    return next(new Error("Account not verified"));
                }

                socket.user = {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };
                
                return next();

            } catch (tokenError) {
                // Handle expired access token
                if (tokenError.name === 'TokenExpiredError') {
                    try {
                        // Find token document
                        const tokenDoc = await Token.findOne({ accessToken: token });
                        
                        if (!tokenDoc) {
                            return next(new Error("Token not found in database"));
                        }

                        // Verify refresh token
                        const refreshDecoded = verifyRefreshToken(tokenDoc.refreshToken);
                        
                        // Generate new access token
                        const user = await User.findById(refreshDecoded.userId).select('-passwordHash');
                        
                        if (!user) {
                            return next(new Error("User not found"));
                        }

                        const newAccessToken = generateAccessToken(user);

                        // Update token document
                        tokenDoc.accessToken = newAccessToken;
                        tokenDoc.expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5 hours
                        await tokenDoc.save();

                        // Set user data and emit new token
                        socket.user = {
                            userId: user._id,
                            username: user.username,
                            email: user.email,
                            role: user.role
                        };

                        // Emit new access token to client
                        socket.emit('token_refresh', { accessToken: newAccessToken });
                        
                        return next();
                    } catch (refreshError) {
                        console.error('Refresh token error:', refreshError);
                        return next(new Error("Invalid refresh token"));
                    }
                }
                
                return next(new Error("Invalid access token"));
            }
        } catch (err) {
            console.error('Socket authentication error:', err);
            return next(new Error("Authentication failed"));
        }
    });

    // Connection event handling
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.username} (${socket.user.userId})`);

        // Handle client-side token refresh requests
        socket.on('request_token_refresh', async () => {
            try {
                const tokenDoc = await Token.findOne({ 
                    userId: socket.user.userId 
                }).sort({ createdAt: -1 });

                if (tokenDoc) {
                    const newAccessToken = generateAccessToken({
                        _id: socket.user.userId,
                        username: socket.user.username,
                        email: socket.user.email,
                        role: socket.user.role
                    });

                    tokenDoc.accessToken = newAccessToken;
                    tokenDoc.expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000);
                    await tokenDoc.save();

                    socket.emit('token_refresh', { accessToken: newAccessToken });
                }
            } catch (error) {
                console.error('Token refresh error:', error);
                socket.emit('error', { message: 'Token refresh failed' });
            }
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log(`User disconnected: ${socket.user.username} (${socket.user.userId}), Reason: ${reason}`);
        });
    });

    return io;
}

module.exports = initializeSocket;