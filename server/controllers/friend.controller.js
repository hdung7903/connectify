const User = require('../models/user.model');
const mongoose = require('mongoose');
const createHttpError = require('http-errors');

// Send friend request
const sendFriendRequest = async (req, res, next) => {
    try {
        const { recipientId } = req.body;
        const userId = req.user.userId;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(recipientId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw createHttpError(400, "Invalid ID format");
        }

        const [user, recipient] = await Promise.all([
            User.findById(userId),
            User.findById(recipientId)
        ]);

        // Validate users exist and are active
        if (!user || user.isDeleted || !user.isActive) {
            throw createHttpError(404, "User not found or inactive");
        }
        if (!recipient || recipient.isDeleted || !recipient.isActive) {
            throw createHttpError(404, "Recipient not found or inactive");
        }

        // Validate request conditions
        if (userId === recipientId) {
            throw createHttpError(400, "Cannot send friend request to yourself");
        }
        if (user.friendRequestsSent.includes(recipientId)) {
            throw createHttpError(400, "Friend request already sent");
        }
        if (user.friends.includes(recipientId)) {
            throw createHttpError(400, "Already friends with this user");
        }
        if (recipient.friendRequestsReceived.includes(userId)) {
            throw createHttpError(400, "Friend request already pending");
        }

        await Promise.all([
            User.findByIdAndUpdate(userId, {
                $addToSet: { friendRequestsSent: recipientId }
            }),
            User.findByIdAndUpdate(recipientId, {
                $addToSet: { friendRequestsReceived: userId }
            })
        ]);

        res.status(200).json({
            success: true,
            message: "Friend request sent successfully"
        });

    } catch (error) {
        next(error);
    }
};

// Accept friend request
const acceptFriendRequest = async (req, res, next) => {
    try {
        const { requesterId } = req.body;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(requesterId)) {
            throw createHttpError(400, "Invalid requester ID format");
        }

        const [user, requester] = await Promise.all([
            User.findById(userId),
            User.findById(requesterId)
        ]);

        if (!requester || !user.friendRequestsReceived.includes(requesterId)) {
            throw createHttpError(404, "Friend request not found");
        }

        await Promise.all([
            User.findByIdAndUpdate(userId, {
                $addToSet: { friends: requesterId },
                $pull: { friendRequestsReceived: requesterId }
            }),
            User.findByIdAndUpdate(requesterId, {
                $addToSet: { friends: userId },
                $pull: { friendRequestsSent: userId }
            })
        ]);


        res.status(200).json({
            success: true,
            message: "Friend request accepted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// Reject friend request
const rejectFriendRequest = async (req, res, next) => {
    try {
        const { requesterId } = req.body;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(requesterId)) {
            throw createHttpError(400, "Invalid requester ID format");
        }

        // await Promise.all([
        //     User.findByIdAndUpdate(userId, {
        //         $pull: { friendRequestsReceived: requesterId }
        //     }),
        //     User.findByIdAndUpdate(requesterId, {
        //         $pull: { friendRequestsSent: userId }
        //     })
        // ]);

        User.findByIdAndUpdate(userId, {
            $pull: { friendRequestsReceived: requesterId }
        });
        User.findByIdAndUpdate(requesterId, {
            $pull: { friendRequestsSent: userId }
        });

        res.status(200).json({
            success: true,
            message: "Friend request rejected successfully"
        });
    } catch (error) {
        next(error);
    }
};

// Cancel sent friend request
const cancelFriendRequest = async (req, res, next) => {
    try {
        const { recipientId } = req.body;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            throw createHttpError(400, "Invalid recipient ID format");
        }

        await Promise.all([
            User.findByIdAndUpdate(userId, {
                $pull: { friendRequestsSent: recipientId }
            }),
            User.findByIdAndUpdate(recipientId, {
                $pull: { friendRequestsReceived: userId }
            })
        ]);

        res.status(200).json({
            success: true,
            message: "Friend request canceled successfully"
        });
    } catch (error) {
        next(error);
    }
};

// Unfriend user
const unfriend = async (req, res, next) => {
    try {
        const { friendId } = req.body;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(friendId)) {
            throw createHttpError(400, "Invalid friend ID format");
        }

        const [user, friend] = await Promise.all([
            User.findById(userId),
            User.findById(friendId)
        ]);

        if (!friend || !user.friends.includes(friendId)) {
            throw createHttpError(404, "Friend relationship not found");
        }

        await Promise.all([
            User.findByIdAndUpdate(userId, {
                $pull: { friends: friendId }
            }),
            User.findByIdAndUpdate(friendId, {
                $pull: { friends: userId }
            })
        ]);

        res.status(200).json({
            success: true,
            message: "Unfriended successfully"
        });
    } catch (error) {
        next(error);
    }
};

// Get friend suggestions
const getSuggestionFriends = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId);
        if (!user) {
            throw createHttpError(404, "User not found");
        }

        // Get all IDs to exclude
        const excludeIds = [
            userId,
            ...user.friends,
            ...user.friendRequestsSent,
            ...user.friendRequestsReceived
        ];

        const suggestions = await User.find({
            _id: { $nin: excludeIds },
            isDeleted: false,
            isActive: true
        })
            .select('username avatarUrl bio')
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await User.countDocuments({
            _id: { $nin: excludeIds },
            isDeleted: false,
            isActive: true
        });

        res.status(200).json({
            success: true,
            data: suggestions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasMore: skip + suggestions.length < total
            }
        });

    } catch (error) {
        next(error);
    }
};

// Get received friend requests
const getFriendRequests = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId);
        if (!user) {
            throw createHttpError(404, "User not found");
        }

        const requests = await User.find({
            _id: { $in: user.friendRequestsReceived },
            isDeleted: false,
            isActive: true
        })
            .select('username avatarUrl bio createdAt')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        const total = await User.countDocuments({
            _id: { $in: user.friendRequestsReceived },
            isDeleted: false,
            isActive: true
        });

        res.status(200).json({
            success: true,
            data: requests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasMore: skip + requests.length < total
            }
        });

    } catch (error) {
        next(error);
    }
};

// Get sent friend requests
const getSentRequests = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId);
        if (!user) {
            throw createHttpError(404, "User not found");
        }

        const sentRequests = await User.find({
            _id: { $in: user.friendRequestsSent },
            isDeleted: false,
            isActive: true
        })
            .select('username avatarUrl bio createdAt')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        const total = await User.countDocuments({
            _id: { $in: user.friendRequestsSent },
            isDeleted: false,
            isActive: true
        });

        res.status(200).json({
            success: true,
            data: sentRequests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasMore: skip + sentRequests.length < total
            }
        });

    } catch (error) {
        next(error);
    }
};

const getFriendsList = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || '';

        const user = await User.findById(userId);
        if (!user) {
            throw createHttpError(404, "User not found");
        }

        const searchCondition = searchQuery ? {
            username: { $regex: searchQuery, $options: 'i' }
        } : {};

        const friends = await User.find({
            _id: { $in: user.friends },
            isDeleted: false,
            isActive: true,
            ...searchCondition
        })
        .select('username avatarUrl bio location createdAt')
        .skip(skip)
        .limit(limit)
        .sort({ username: 1 })
        .lean();

        const total = await User.countDocuments({
            _id: { $in: user.friends },
            isDeleted: false,
            isActive: true,
            ...searchCondition
        });

        res.status(200).json({
            success: true,
            data: friends,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasMore: skip + friends.length < total
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    unfriend,
    getSuggestionFriends,
    getFriendRequests,
    getSentRequests,
    getFriendsList,
};