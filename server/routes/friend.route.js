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

/**
 * @swagger
 * /send-request:
 *   post:
 *     summary: Send a friend request to another user
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: The ID of the user to send the friend request to.
 *     responses:
 *       200:
 *         description: Friend request sent successfully
 *       400:
 *         description: Invalid ID format or friend request already exists
 *       404:
 *         description: User or recipient not found or inactive
 */

friendRouter.post('/send-request', sendFriendRequest);
/**
 * @swagger
 * /accept-request:
 *   post:
 *     summary: Accept a friend request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requesterId:
 *                 type: string
 *                 description: The ID of the user who sent the friend request.
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       400:
 *         description: Invalid requester ID format
 *       404:
 *         description: Friend request not found
 */
friendRouter.post('/accept-request', acceptFriendRequest);
/**
 * @swagger
 * /reject-request:
 *   post:
 *     summary: Reject a friend request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requesterId:
 *                 type: string
 *                 description: The ID of the user who sent the friend request.
 *     responses:
 *       200:
 *         description: Friend request rejected successfully
 *       400:
 *         description: Invalid requester ID format
 *       404:
 *         description: Friend request not found
 */
friendRouter.post('/reject-request', rejectFriendRequest);
/**
 * @swagger
 * /cancel-request:
 *   post:
 *     summary: Cancel a sent friend request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: The ID of the user to whom the friend request was sent.
 *     responses:
 *       200:
 *         description: Friend request canceled successfully
 *       400:
 *         description: Invalid recipient ID format
 *       404:
 *         description: Friend request not found
 */
friendRouter.post('/cancel-request', cancelFriendRequest);
/**
 * @swagger
 * /unfriend:
 *   post:
 *     summary: Unfriend a user
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendId:
 *                 type: string
 *                 description: The ID of the friend to unfriend.
 *     responses:
 *       200:
 *         description: Unfriended successfully
 *       400:
 *         description: Invalid friend ID format
 *       404:
 *         description: Friend relationship not found
 */
friendRouter.post('/unfriend', unfriend);
/**
 * @swagger
 * /suggestions:
 *   get:
 *     summary: Get friend suggestions
 *     tags: [Friends]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of suggestions
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *     responses:
 *       200:
 *         description: A list of friend suggestions
 */
friendRouter.get('/suggestions', getSuggestionFriends);
/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get received friend requests
 *     tags: [Friends]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of requests
 *     responses:
 *       200:
 *         description: A list of received friend requests
 */

friendRouter.get('/requests', getFriendRequests);
/**
 * @swagger
 * /sent-requests:
 *   get:
 *     summary: Get sent friend requests
 *     tags: [Friends]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of sent requests
 *     responses:
 *       200:
 *         description: A list of sent friend requests
 */
friendRouter.get('/sent-requests', getSentRequests);
/**
 * @swagger
 * /list:
 *   get:
 *     summary: Get the user's friend list
 *     tags: [Friends]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of friends listed
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: A search query for filtering friends by username
 *     responses:
 *       200:
 *         description: A list of friends
 */
friendRouter.get('/list', getFriendsList);

module.exports = friendRouter;