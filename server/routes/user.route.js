const express = require('express');
const userRouter = express.Router();
const { getUser, updateAvatar, updateCover, updateInfo } = require('../controllers/user.controller');

userRouter.get('/:userId', getUser);
userRouter.patch('/avatar', updateAvatar);
userRouter.patch('/cover', updateCover);
userRouter.put('/info', updateInfo);

module.exports = userRouter;

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     avatarUrl:
 *                       type: string
 *                     coverUrl:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                     dob:
 *                       type: string
 *                       format: date
 *                     location:
 *                       type: object
 *                       properties:
 *                         city:
 *                           type: string
 *                         country:
 *                           type: string
 *                         lat:
 *                           type: number
 *                         long:
 *                           type: number
 *                     friends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           avatarUrl:
 *                             type: string
 *       404:
 *         description: User not found
 * 
 * /users/avatar:
 *   patch:
 *     summary: Update user's avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - avatarUrl
 *             properties:
 *               avatarUrl:
 *                 type: string
 *                 description: URL of the new avatar image
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Avatar updated successfully
 *                 avatarUrl:
 *                   type: string
 *       400:
 *         description: Avatar URL is required
 *       404:
 *         description: User not found
 * 
 * /users/cover:
 *   patch:
 *     summary: Update user's cover photo
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coverUrl
 *             properties:
 *               coverUrl:
 *                 type: string
 *                 description: URL of the new cover image
 *     responses:
 *       200:
 *         description: Cover photo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cover photo updated successfully
 *                 coverUrl:
 *                   type: string
 *       400:
 *         description: Cover URL is required
 *       404:
 *         description: User not found
 * 
 * /users/info:
 *   put:
 *     summary: Update user profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: New username (3-30 characters, alphanumeric and underscores only)
 *               bio:
 *                 type: string
 *                 description: User biography (max 500 characters)
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: User gender
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Date of birth (must be at least 13 years old)
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *                   lat:
 *                     type: number
 *                   long:
 *                     type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     dob:
 *                       type: string
 *                       format: date
 *                     location:
 *                       type: object
 *                       properties:
 *                         city:
 *                           type: string
 *                         country:
 *                           type: string
 *                         lat:
 *                           type: number
 *                         long:
 *                           type: number
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Username must be between 3 and 30 characters
 *       404:
 *         description: User not found
 *       409:
 *         description: Username is already taken
 */