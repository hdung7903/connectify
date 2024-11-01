const User = require('../models/user.model');
const mongoose = require('mongoose');

// Gửi yêu cầu kết bạn
const sendFriendRequest = async (req, res) => {
    try {
        const { recipientId } = req.body;

        // Kiểm tra và chuyển đổi recipientId thành ObjectId
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ message: "Invalid recipient ID format" });
        }

        const user = await User.findById(req.user.userId);
        const recipient = await User.findById(recipientId);

        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        if (!user.friendRequestsSent.includes(recipientId)) {
            user.friendRequestsSent.push(recipientId);
            recipient.friendRequestsReceived.push(user._id);

            await user.save();
            await recipient.save();

            res.status(200).json({ message: "Friend request sent" });
        } else {
            res.status(400).json({ message: "Friend request already sent" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

// Chấp nhận yêu cầu kết bạn
const acceptFriendRequest = async (req, res) => {
    const { requesterId } = req.body;
    const user = await User.findById(req.user.userId);
    const requester = await User.findById(requesterId);

    if (!requester || !user.friendRequestsReceived.includes(requesterId)) {
        return res.status(404).json({ message: "Friend request not found" });
    }

    user.friends.push(requesterId);
    requester.friends.push(user._id);

    user.friendRequestsReceived = user.friendRequestsReceived.filter(
        (id) => id.toString() !== requesterId
    );
    requester.friendRequestsSent = requester.friendRequestsSent.filter(
        (id) => id.toString() !== user._id
    );

    await user.save();
    await requester.save();

    res.status(200).json({ message: "Friend request accepted" });
};

// Từ chối yêu cầu kết bạn
const rejectFriendRequest = async (req, res) => {
    const { requesterId } = req.body;
    const user = await User.findById(req.user.userId);
    const requester = await User.findById(requesterId);

    if (!requester || !user.friendRequestsReceived.includes(requesterId)) {
        return res.status(404).json({ message: "Friend request not found" });
    }

    user.friendRequestsReceived = user.friendRequestsReceived.filter(
        (id) => id.toString() !== requesterId
    );
    requester.friendRequestsSent = requester.friendRequestsSent.filter(
        (id) => id.toString() !== user._id
    );

    await user.save();
    await requester.save();

    res.status(200).json({ message: "Friend request rejected" });
};

// Hủy yêu cầu kết bạn
const cancelFriendRequest = async (req, res) => {
    try {
        const { recipientId } = req.body;
        
        // Kiểm tra nếu recipientId không phải là ObjectId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ message: "Invalid recipient ID format" });
        }

        const user = await User.findById(req.user.userId);
        const recipient = await User.findById(recipientId);

        if (!recipient || !user.friendRequestsSent.includes(recipientId)) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Loại bỏ recipientId khỏi danh sách friendRequestsSent của người gửi
        user.friendRequestsSent = user.friendRequestsSent.filter(
            (id) => id.toString() !== recipientId
        );
        
        // Loại bỏ userId khỏi danh sách friendRequestsReceived của người nhận
        recipient.friendRequestsReceived = recipient.friendRequestsReceived.filter(
            (id) => id.toString() !== user._id.toString()
        );

        await user.save();
        await recipient.save();

        res.status(200).json({ message: "Friend request canceled" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
    }
};


// Lấy danh sách bạn bè
const getFriends = async (req, res) => {
    const user = await User.findById(req.user.userId).populate('friends', 'username avatarUrl');
    res.status(200).json(user.friends);
};

// Xóa bạn bè
const unfriend = async (req, res) => {
    const { friendId } = req.body;
    const user = await User.findById(req.user.userId);
    const friend = await User.findById(friendId);

    if (!friend || !user.friends.includes(friendId)) {
        return res.status(404).json({ message: "Friend not found" });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== user._id);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Unfriended successfully" });
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    getFriends,
    unfriend
};
