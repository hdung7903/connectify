const express = require('express');
const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    unfriend,
    getSuggestionFriends,
    getFriendRequests,
    getSentRequests,
    getFriendsList,
} = require('../controllers/friend.controller');

const friendRouter = express.Router();

friendRouter.post('/send-request', sendFriendRequest);
friendRouter.post('/accept-request', acceptFriendRequest);
friendRouter.post('/reject-request', rejectFriendRequest);
friendRouter.post('/cancel-request', cancelFriendRequest);
friendRouter.post('/unfriend', unfriend);
friendRouter.get('/suggestions', getSuggestionFriends);
friendRouter.get('/requests', getFriendRequests);
friendRouter.get('/sent-requests', getSentRequests);
friendRouter.get('/list', getFriendsList);

module.exports = friendRouter;