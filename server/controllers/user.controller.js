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

module.exports = {
    getUser,
    updateAvatar,
    updateCover
};