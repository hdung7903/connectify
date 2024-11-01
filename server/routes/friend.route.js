const express = require('express');
const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    getFriends,
    unfriend
} = require('../controllers/friend.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Middleware xác thực

const friendRouter = express.Router();

// Các route liên quan đến bạn bè
friendRouter.post('/send-request', authMiddleware, sendFriendRequest); // Gửi yêu cầu kết bạn
friendRouter.post('/accept-request', authMiddleware, acceptFriendRequest); // Chấp nhận yêu cầu kết bạn
friendRouter.post('/reject-request', authMiddleware, rejectFriendRequest); // Từ chối yêu cầu kết bạn
friendRouter.post('/cancel-request', authMiddleware, cancelFriendRequest); // Hủy yêu cầu kết bạn
friendRouter.get('/list', authMiddleware, getFriends); // Lấy danh sách bạn bè
friendRouter.post('/unfriend', authMiddleware, unfriend); // Xóa bạn bè

module.exports = friendRouter;
