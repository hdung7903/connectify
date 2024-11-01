const Post = require('../models/post.model');
const Notification = require('../models/notification.model');

function postHandler(io) {
    const connectedUsers = new Map(); 

    io.on('connection', (socket) => {
        const userId = socket.user.userId;
        connectedUsers.set(userId, socket.id);

        socket.on('post_reaction', async (data) => {
            try {
                const { postId, reactionType } = data;
                const post = await Post.findById(postId).populate('ownerId', 'username');

                if (!post) {
                    socket.emit('error', { message: 'Post not found' });
                    return;
                }

                if (post.ownerId._id.toString() !== userId) {
                    const notification = new Notification({
                        userId: post.ownerId._id,
                        type: 'reaction',
                        content: `${socket.user.username} reacted ${reactionType} to your post`,
                        relatedId: postId,
                        linkUrl: `/post/${postId}`
                    });
                    await notification.save();

                    const ownerSocketId = connectedUsers.get(post.ownerId._id.toString());
                    if (ownerSocketId) {
                        io.to(ownerSocketId).emit('new_notification', notification);
                    }
                }

                io.emit('post_updated', { postId, reactions: post.reactions });
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        socket.on('post_comment', async (data) => {
            try {
                const { postId, content } = data;
                const post = await Post.findById(postId).populate('ownerId', 'username');

                if (!post) {
                    socket.emit('error', { message: 'Post not found' });
                    return;
                }

                if (post.ownerId._id.toString() !== userId) {
                    const notification = new Notification({
                        userId: post.ownerId._id,
                        type: 'comment',
                        content: `${socket.user.username} commented on your post: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
                        relatedId: postId,
                        linkUrl: `/post/${postId}`
                    });
                    await notification.save();

                    const ownerSocketId = connectedUsers.get(post.ownerId._id.toString());
                    if (ownerSocketId) {
                        io.to(ownerSocketId).emit('new_notification', notification);
                    }
                }

                io.emit('post_updated', { postId, comments: post.comments });
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        socket.on('comment_reply', async (data) => {
            try {
                const { postId, commentId, content } = data;
                const post = await Post.findById(postId).populate('ownerId', 'username');
                const comment = post.comments.id(commentId);

                if (!comment) {
                    socket.emit('error', { message: 'Comment not found' });
                    return;
                }

                if (comment.userId.toString() !== userId) {
                    const notification = new Notification({
                        userId: comment.userId,
                        type: 'comment',
                        content: `${socket.user.username} replied to your comment: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
                        relatedId: postId,
                        linkUrl: `/post/${postId}`
                    });
                    await notification.save();

                    const commentOwnerSocketId = connectedUsers.get(comment.userId.toString());
                    if (commentOwnerSocketId) {
                        io.to(commentOwnerSocketId).emit('new_notification', notification);
                    }
                }

                io.emit('post_updated', { postId, comments: post.comments });
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        socket.on('comment_reaction', async (data) => {
            try {
                const { postId, commentId, reactionType } = data;
                const post = await Post.findById(postId).populate('ownerId', 'username');
                const comment = post.comments.id(commentId);

                if (!comment) {
                    socket.emit('error', { message: 'Comment not found' });
                    return;
                }

                if (comment.userId.toString() !== userId) {
                    const notification = new Notification({
                        userId: comment.userId,
                        type: 'reaction',
                        content: `${socket.user.username} reacted ${reactionType} to your comment`,
                        relatedId: postId,
                        linkUrl: `/post/${postId}`
                    });
                    await notification.save();

                    const commentOwnerSocketId = connectedUsers.get(comment.userId.toString());
                    if (commentOwnerSocketId) {
                        io.to(commentOwnerSocketId).emit('new_notification', notification);
                    }
                }

                io.emit('post_updated', { postId, comments: post.comments });
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        socket.on('post_share', async (data) => {
            try {
                const { postId } = data;
                const post = await Post.findById(postId).populate('ownerId', 'username');

                if (!post) {
                    socket.emit('error', { message: 'Post not found' });
                    return;
                }

                if (post.ownerId._id.toString() !== userId) {
                    const notification = new Notification({
                        userId: post.ownerId._id,
                        type: 'share',
                        content: `${socket.user.username} shared your post`,
                        relatedId: postId,
                        linkUrl: `/post/${postId}`
                    });
                    await notification.save();

                    const ownerSocketId = connectedUsers.get(post.ownerId._id.toString());
                    if (ownerSocketId) {
                        io.to(ownerSocketId).emit('new_notification', notification);
                    }
                }

                io.emit('post_updated', { postId, sharesCount: post.sharesCount });
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        socket.on('disconnect', () => {
            connectedUsers.delete(userId);
        });
    });
}

module.exports = postHandler;