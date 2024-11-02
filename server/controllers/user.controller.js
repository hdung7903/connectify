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

module.exports = {
    getUser,
};