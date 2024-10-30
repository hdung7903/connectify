const Post = require('../models/post.model');
const User = require('../models/user.model');

// Tạo post mới
const createPost = async (req, res) => {
    try {
        const { title, content, media, visibility, tags } = req.body;
        const newPost = new Post({
            ownerId: req.user.userId,
            title,
            content,
            media,
            visibility,
            tags
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thả cảm xúc cho post
const reactToPost = async (req, res) => {
    try {
        const { postId, reactionType } = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Kiểm tra nếu người dùng đã thả cảm xúc thì cập nhật
        const existingReaction = post.reactions.find(
            (r) => r.userId.toString() === req.user.userId.toString()
        );

        if (existingReaction) {
            existingReaction.type = reactionType;
        } else {
            post.reactions.push({ userId: req.user.userId, type: reactionType });
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Thả cảm xúc cho bình luận
const reactToComment = async (req, res) => {
    try {
        const { postId, commentId, reactionType } = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Kiểm tra nếu người dùng đã thả cảm xúc cho bình luận này
        const existingReaction = comment.reactions.find(
            (r) => r.userId.toString() === req.user.userId.toString()
        );

        if (existingReaction) {
            // Nếu đã tồn tại, cập nhật loại cảm xúc mới
            existingReaction.type = reactionType;
        } else {
            // Nếu chưa tồn tại, thêm cảm xúc mới
            comment.reactions.push({ userId: req.user.userId, type: reactionType });
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bình luận trên post
const commentOnPost = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({ userId: req.user.userId, content });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Phản hồi bình luận
const replyToComment = async (req, res) => {
    try {
        const { postId, commentId, content } = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.replies.push({ userId: req.user.userId, content });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Chia sẻ post
const sharePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.sharesCount += 1;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    reactToPost,
    commentOnPost,
    replyToComment,
    reactToComment,
    sharePost
};
