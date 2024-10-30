const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken } = require('../config/jwt.config.js');
const jwt = require('jsonwebtoken');
const path = require('path');
const ejs = require('ejs');
const transporter = require('../config/transporter.js');

const createUser = async (req, res, next) => {
    const { username, email, password, gender, dob } = req.body;

    if (!username || !email || !password || !gender || !dob) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const verificationCode = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            passwordHash,
            gender,
            dob: new Date(dob),
            avatarUrl: '',
            bio: null,
            location: {
                city: '',
                country: '',
                lat: 0,
                long: 0
            },
            interests: [],
            role: 'user',
            accountVerification: {
                isVerified: false,
                verificationCode: verificationCode,
            }
        });

        await newUser.save();

        const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationCode}/${email}`

        await sendVerificationEmail(username, email, verificationLink);

        res.status(201).json({
            message: 'User created successfully. Verification email sent.',
        });

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    }
};

const login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (user.accountVerification.isVerified === false) {
            return res.status(401).json({ message: 'Please verify your email' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ accessToken });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const refreshToken = async (req, res, next) => {
    if (req.cookies?.refreshToken) {

        // Destructuring refreshToken from cookie
        const refreshToken = req.cookies.refreshToken;

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.status(406).json({ message: 'Unauthorized' });
                }
                else {
                    // Correct token we send a new access token
                    const accessToken = generateAccessToken(decoded);
                    return res.json({ accessToken });
                }
            })
    } else {
        return res.status(406).json({ message: 'Unauthorized' });
    }
}

const logout = async (req, res, next) => {
    const { refreshToken } = req.body;

    try {
        await revokeRefreshToken(refreshToken);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const verifyUser = async (req, res, next) => {
    const { token, email } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.email !== email) {
            return res.status(400).json({ message: 'Email does not match token' });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.set({
            accountVerification: {
                isVerified: true,
                verificationCode: null,
                verifiedAt: new Date(),
            }
        });

        await user.save();

        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }

        return res.status(400).json({ message: 'Invalid token' });
    }
};

const resendVerification = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.accountVerification.isVerified === true) {
            return res.status(400).json({ message: 'User already verified' });
        }

        const verificationLink = `http://localhost:3000/auth/verify-account?token=${user.accountVerification.token}&email=${user.email}`;
        const info = await sendVerificationEmail(user.username, user.email, verificationLink);

        user.set({
            accountVerification: {
                isVerified: true,
                verificationCode: null,
                verifiedAt: new Date(),
            }
        });

        await user.save();

        res.status(200).json({ message: 'Verification email sent', info });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const sendVerificationEmail = async (username, email, verificationLink) => {
    const templatePath = path.join(__dirname, '../views/verifyAccount.ejs');

    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, { username, verificationLink }, (err, data) => {
            if (err) {
                return reject(new Error('Error rendering email template'));
            }

            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify Your Account',
                html: data
            }, (err, info) => {
                if (err) {
                    return reject(new Error('Error sending email'));
                }

                resolve(info.response);
            });
        });
    });
};

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const verificationCode = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1m' });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${verificationCode}/${user.email}`;

        const info = await sendResetPasswordEmail(user.username, user.email, resetLink);

        res.status(200).json({ message: 'Password reset email sent', info });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const checkResetPasswordToken = async (req, res, next) => {
    const { token, email } = req.params;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the email matches the token
        if (decoded.email !== email) {
            return res.status(400).json({ message: 'Email does not match token' });
        }

        // If everything is valid, respond with a success message
        res.status(200).json({ message: 'Token is valid. You can reset your password.' });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

const resetPassword = async (req, res, next) => {
    const { token, email, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.email !== email) {
            return res.status(400).json({ message: 'Email does not match token' });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.set({ password: hashedPassword });
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const resendForgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const verificationCode = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1m' });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${verificationCode}/${user.email}`;

        const info = await sendResetPasswordEmail(user.username, user.email, resetLink);

        res.status(200).json({ message: 'Password reset email sent', info });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendResetPasswordEmail = async (username, email, resetLink) => {
    const templatePath = path.join(__dirname, '../views/resetPassword.ejs');

    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, { username, resetLink }, (err, data) => {
            if (err) {
                return reject(new Error('Error rendering email template'));
            }
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Reset Your Password',
                html: data
            }, (err, info) => {
                if (err) {
                    return reject(new Error('Error sending email'));
                }

                resolve(info.response);
            });
        });
    });
};


const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-passwordHash')
            .lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            gender: user.gender,
            dob: user.dob,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            location: user.location,
            interests: user.interests,
            role: user.role,
            accountVerification: user.accountVerification,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });

    } catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

module.exports = {
    createUser,
    login,
    refreshToken,
    logout,
    verifyUser,
    resendVerification,
    forgotPassword,
    resetPassword,
    checkResetPasswordToken,
    resendForgotPassword,
    getMe
};