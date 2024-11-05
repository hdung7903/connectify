const createHttpError = require('http-errors');
const User = require('../models/user.model');

const getUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId)
            .select('-password -friendRequestsSent -friendRequestsReceived -role -accountVerification -createdAt -updatedAt -__v')
            .populate('friends', 'username avatarUrl')
            .exec();
        if (!user) {
            throw createHttpError.NotFound('User not found');
        }
        res.status(200).json({
            user
        });

    } catch (error) {
        next(error);
    }
};

const updateAvatar = async (req, res, next) => {
    try {
        const { avatarUrl } = req.body;
        const userId = req.user.userId;

        if (!avatarUrl) {
            throw createHttpError.BadRequest('Avatar URL is required');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw createHttpError.NotFound('User not found');
        }

        // Update avatar URL
        user.avatarUrl = avatarUrl;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Avatar updated successfully',
            avatarUrl: user.avatarUrl
        });
    } catch (error) {
        next(error);
    }
};

const updateCover = async (req, res, next) => {
    try {
        const { coverUrl } = req.body;
        const userId = req.user.userId;

        if (!coverUrl) {
            throw createHttpError.BadRequest('Cover URL is required');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw createHttpError.NotFound('User not found');
        }

        // Update cover URL
        user.coverUrl = coverUrl;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Cover photo updated successfully',
            coverUrl: user.coverUrl
        });
    } catch (error) {
        next(error);
    }
};

const updateInfo = async (req, res, next) => {
    try {
        const { username, bio, gender, dob, location } = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            throw createHttpError.NotFound('User not found');
        }

        if (username) {
            if (username !== user.username) {
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw createHttpError.Conflict('Username is already taken');
                }
                // Validate username format
                if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                    throw createHttpError.BadRequest('Username can only contain letters, numbers and underscores');
                }
                if (username.length < 3 || username.length > 30) {
                    throw createHttpError.BadRequest('Username must be between 3 and 30 characters');
                }
                user.username = username;
            }
        }

        // Validate and update gender if provided
        if (gender) {
            if (!['male', 'female', 'other'].includes(gender)) {
                throw createHttpError.BadRequest('Invalid gender value');
            }
            user.gender = gender;
        }

        // Validate and update DOB if provided
        if (dob) {
            const dobDate = moment(dob);
            if (!dobDate.isValid()) {
                throw createHttpError.BadRequest('Invalid date of birth');
            }
            if (moment().diff(dobDate, 'years') < 13) {
                throw createHttpError.BadRequest('User must be at least 13 years old');
            }
            user.dob = dobDate.toDate();
        }

        // Update bio if provided
        if (bio !== undefined) {
            if (bio.length > 500) {
                throw createHttpError.BadRequest('Bio must not exceed 500 characters');
            }
            user.bio = bio;
        }

        // Update location if provided
        if (location) {
            user.location = {
                city: location.city || user.location?.city,
                country: location.country || user.location?.country,
                lat: location.lat || user.location?.lat,
                long: location.long || user.location?.long
            };
        }

        await user.save();

        // Return updated user without sensitive information
        const updatedUser = await User.findById(userId)
            .select('-passwordHash -friendRequestsSent -friendRequestsReceived -role -accountVerification -verifiedCode -isDeleted -isActive -__v')
            .populate('friends', 'username avatarUrl')
            .populate('followers', 'username avatarUrl')
            .populate('following', 'username avatarUrl');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUser,
    updateAvatar,
    updateCover,
    updateInfo
};