const Post = require('../models/post.model');
const User = require('../models/user.model');

// Tạo post mới
const createPost = async (req, res) => {
    try {
        const { title, content, media, visibility, tags, sharedPostId } = req.body;
        const newPost = new Post({
            ownerId: req.user.userId,
            title,
            content,
            media,
            visibility,
            tags,
            sharedPostId
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

        const existingReaction = post.reactions.find(
            (r) => r.userId.toString() === req.user.userId.toString()
        );

        if (existingReaction) {
            existingReaction.type = reactionType;
        } else {
            post.reactions.push({ userId: req.user.userId, type: reactionType });
        }

        post.reactsCount = post.reactions.filter(r => r.type !== null).length;

        await post.save();
        res.status(201).json(post);
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
        const { parentCommentId, content, postId } = req.body;
        // const {  } = req.query;
        const { userId } = req.user;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        let parentComment;
        if (parentCommentId) {
            parentComment = post.comments.id(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ message: 'Parent comment not found' });
            }
        }
        const newReply = {
            userId,
            content,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (parentComment) {
            parentComment.replies.push(newReply);
        } else {
            post.comments.push({
                userId,
                content,
                reactions: [],
                replies: [newReply],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        await post.save();
        res.status(201).json(newReply);
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

// Lấy danh sách bài viết của người dùng hiện tại (người đăng nhập)
const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
        if (posts.length === 0) {
            return res.status(200).json({ message: 'You have not posted anything yet.' });
        }
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user's own posts:", error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (post.length === 0 || !post) {
            return res.status(404).json({ message: 'You have not this post' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching user's own posts:", error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

// Lấy bài viết của người dùng khác
const getUserPosts = async (req, res) => {
    const { userId } = req.params;

    try {
        // Kiểm tra nếu userId trùng với userId của người đang đăng nhập
        if (userId === req.user.userId.toString()) {
            return res.status(403).json({ message: 'Not allowed to access your own posts through this endpoint' });
        }

        // Tìm kiếm bài viết công khai của người dùng khác
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await Post.find({ ownerId: userId, visibility: 'public' }).sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(200).json({ message: 'This user has no public posts' });
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const renderPost = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById(userId).populate('friends');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const friendIds = Array.isArray(user.friends) ? user.friends.map(friend => friend._id) : [];

        const posts = await Post.find({
            $or: [
                { ownerId: userId },
                {
                    ownerId: { $in: friendIds },
                    visibility: 'friends'
                },
                { visibility: 'public' }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: error.message });
    }
};

const getOwnerPost = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10;

        const user = await User.findById(userId).select('username').lean().exec();

        const posts = await Post.find({ ownerId: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean() // Add lean() for better performance
            .exec();

        const modifiedPosts = posts.map(post => ({
            ...post,
            ownerId: {
                _id: user._id,
                username: user.username,
            }
        }));

        console.log('Modified posts:', modifiedPosts);

        res.status(200).json(modifiedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPostByUserId = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const findUserById = await User.findById(userId);
        if (!findUserById) {
            return res.status(404).json({ message: 'User not found' });
        }
        const posts = await Post.find({ ownerId: userId });
        if (!posts) {
            return res.status(404).json({ message: 'Posts not found' });
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId, 'username avatarUrl');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json(user);
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
    sharePost,
    getMyPosts,
    getUserPosts,
    renderPost,
    getOwnerPost,
    getPostByUserId,
    getUser,
    getPost,
};