import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Modal, Input, Button, Popover, Typography } from 'antd';
import Avatar from '../avatar/Avatar';
import Reaction from '../interact/Reaction';
import CommentButton from '../interact/CommentButton';
import Comments from '../interact/Comments';
import Slideshow from '../slideshow/Slideshow';
import SharePost from '../postCreate/sharePost';
import { ShareAltOutlined, SendOutlined, MoreOutlined, UndoOutlined, UsergroupAddOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import './post.css';
import api from '../../services/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Text, Paragraph } = Typography;

export default function Post(props) {
    const { id, ownerId, title, avatarUrl, content, media, reactsCount, reactions, visibility, createdAt, updatedAt, username, comments, sharesCount, refreshPosts, sharedPostId } = props;
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user._id;

    const [state, setState] = useState({
        ...props,
        showComments: false,
        commentsLoaded: false,
        comments: props.comments || [],
        newComment: '',
        showModal: false,
        hidden: false,
        selectedReaction: reactions.find(reaction => reaction.userId === userId)?.type || null,
        showShareModal: false,
        PostSharedData: null, // Initialize with null
        ownerPostSharedData: null, // Initialize with null
        isLoadingSharedData: true, // Track loading state
    });

    const [expanded, setExpanded] = useState(true);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchComments = () => {
            try {
                setState(prevState => ({
                    ...prevState,
                    comments: props.comments || [],
                    commentsLoaded: true,
                }));
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [props.comments]);

    // Fetch shared post data if there is a sharedPostId
    useEffect(() => {
        const fetchSharedPostData = async () => {
            if (sharedPostId) {
                try {
                    // Fetch the shared post data
                    const userResponse = await api.get(`/posts/post-by-id/${sharedPostId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    });
                    const PostSharedData = userResponse.data;

                    // Fetch owner data of the shared post
                    const ownerResponse = await api.get(`/posts/user/${PostSharedData.ownerId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    });

                    setState(prevState => ({
                        ...prevState,
                        PostSharedData,
                        ownerPostSharedData: {
                            avatarUrl: ownerResponse.data.avatarUrl || 'https://placeholder.co/40x40',
                            username: ownerResponse.data.username || 'Unknown User',
                        },
                        isLoadingSharedData: false, // Mark as loaded
                    }));
                } catch (error) {
                    console.error("Error fetching shared post data:", error);
                    setState(prevState => ({
                        ...prevState,
                        isLoadingSharedData: false, // Mark as loaded even on error
                    }));
                }
            }
        };

        fetchSharedPostData();
    }, [sharedPostId]);

    const handleReaction = async (reactionType) => {
        const newReaction = state.selectedReaction === reactionType ? null : reactionType;
        const updatedReactsCount = newReaction ? state.reactsCount + 1 : state.reactsCount > 0 ? state.reactsCount - 1 : state.reactsCount;

        setState(prevState => ({
            ...prevState,
            selectedReaction: newReaction,
            reactsCount: updatedReactsCount,
        }));

        try {
            const response = await api.post(
                "/posts/react",
                {
                    postId: id,
                    reactionType: newReaction,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    }
                }
            );

            setState(prevState => ({
                ...prevState,
                reactions: response.data.reactions,
                reactsCount: updatedReactsCount
            }));

            refreshPosts();
        } catch (error) {
            console.error("Failed to react to post:", error);
        }
    };

    const handleShareClick = () => {
        setState(prevState => ({
            ...prevState,
            showShareModal: true,
        }));
    };

    const closeShareModal = () => {
        setState(prevState => ({
            ...prevState,
            showShareModal: false,
        }));
    };

    function toggleComments() {
        setState(prevState => ({
            ...prevState,
            showComments: !prevState.showComments
        }));
    }

    function focusCommentInput() {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    function handleCommentChange(e) {
        setState({ ...state, newComment: e.target.value });
    }

    const submitComment = async () => {
        if (state.newComment.trim()) {
            const newComment = {
                postId: id,
                content: state.newComment,
            };

            try {
                const response = await api.post('/posts/comment', newComment, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    }
                });

                refreshPosts();

                setState(prevState => ({
                    ...prevState,
                    comments: [...prevState.comments, response.data],
                    newComment: ''
                }));
            } catch (error) {
                console.error("Failed to comment on post:", error);
            }
        }
    };

    function showAllComments() {
        setState(prevState => ({
            ...prevState,
            showModal: true
        }));
    }

    function closeModal() {
        setState(prevState => ({
            ...prevState,
            showModal: false
        }));
    }

    function parseDateTime(time) {
        const now = Date.now();
        const createdTime = new Date(time).getTime();
        const diffInSeconds = Math.floor((now - createdTime) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute${diffInSeconds === 60 ? '' : 's'}`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${diffInSeconds / 3600 === 1 ? '' : 's'}`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${diffInSeconds / 86400 === 1 ? '' : 's'}`;
        if (diffInSeconds < 2419200) return `${Math.floor(diffInSeconds / 604800)} week${diffInSeconds / 604800 === 1 ? '' : 's'}`;
        if (diffInSeconds < 29030400) return `${Math.floor(diffInSeconds / 2419200)} month${diffInSeconds / 2419200 === 1 ? '' : 's'}`;
        return `${Math.floor(diffInSeconds / 29030400)} year${diffInSeconds / 29030400 === 1 ? '' : 's'} ago`;
    }

    function hidePost() {
        setState(prevState => ({
            ...prevState,
            hidden: true
        }));
    }

    function undoHidePost() {
        setState(prevState => ({
            ...prevState,
            hidden: false
        }));
    }

    const visibilityIcon = (visibility) => {
        switch (visibility) {
            case 'public':
                return <GlobalOutlined />;
            case 'friends':
                return <UsergroupAddOutlined />;
            case 'private':
                return <LockOutlined />;
            default:
                return null;
        }
    }

    const postActionsMenu = (
        <div>
            <div onClick={hidePost} style={{ padding: '8px 0' }}>Hide Post</div>
            <div onClick={() => alert('Post reported')} style={{ padding: '8px 0' }}>Report Post</div>
        </div>
    );

    const postContent = state.hidden ? (
        <div className="post-hidden">
            <span>This post is hidden</span>
            <Button icon={<UndoOutlined />} onClick={undoHidePost} type="link" style={{ marginLeft: 'auto' }}>
                Undo
            </Button>
        </div>
    ) : (
        <>
            <Row justify="space-between" align="middle">
                <Row align="middle" style={{ marginBottom: '16px' }}>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar imgId={avatarUrl || 'https://placeholder.co/40x40'} />
                        <div style={{ marginLeft: '8px' }}>
                            <Text strong><Link to={`/profile/${ownerId}`} className="profile-link">
                                {username}
                            </Link></Text>
                            <Text type="secondary" style={{ display: 'block' }}>{parseDateTime(createdAt)}{visibilityIcon(visibility)}</Text>
                        </div>
                    </Col>
                </Row>
                <Popover content={postActionsMenu} trigger="click">
                    <MoreOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                </Popover>
            </Row>
            <div className="post-split"></div>
            <Row>
                <Col span={24}>
                    <Paragraph ellipsis={{ rows: expanded ? 2 : undefined, expandable: false }}>
                        {content}
                    </Paragraph>
                    {content.length > 100 && (
                        <Text
                            type="secondary"
                            style={{ cursor: 'pointer', color: '#1890ff' }}
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? 'Show more' : 'Show less'}
                        </Text>
                    )}
                    {Array.isArray(media) && media.length > 0 && <Slideshow images={media.map(item => item.url)} />}
                    <div className="post-split"></div>
                    {title === 'Post share' && state.PostSharedData && !state.isLoadingSharedData && (
                        <div className="shared-post">
                            <Paragraph>{state.shareMessage}</Paragraph>
                            <div className="shared-post-content">
                                <Row align="middle">
                                    <Avatar imgId={state.ownerPostSharedData.avatarUrl || 'https://placeholder.co/40x40'} />
                                    <div style={{ marginLeft: '8px' }}>
                                        <Text strong>{state.ownerPostSharedData.username}</Text>
                                    </div>
                                </Row>
                                <Paragraph>{state.PostSharedData.content}</Paragraph>
                                {Array.isArray(state.PostSharedData.media) && state.PostSharedData.media.length > 0 && <Slideshow images={state.PostSharedData.media.map(item => item.url)} />}
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
            <div className="post-stats">
                <div className="post-stats-left">{reactsCount} reactions</div>
                <div className="post-stats-right">{state.comments.length} comments</div>
            </div>
            <div className="post-split"></div>
            <div className="post-actions">
                <Reaction onReaction={handleReaction} selectedReaction={state.selectedReaction} />
                <span onClick={focusCommentInput} className="comment-button">
                    <CommentButton>Comment</CommentButton>
                </span>
                <span className="share-button" onClick={handleShareClick}>
                    <ShareAltOutlined />
                    Share
                </span>
            </div>
            <div className="post-split"></div>
            <div>
                {state.comments.length > 2 && (
                    <div className="view-all-comments" onClick={showAllComments}>
                        View all comments
                    </div>
                )}
                {state.comments.length > 0 ? (
                    <Comments comments={state.comments.slice(0, 2)} postId={id} />
                ) : null}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar imgId={avatarUrl} />
                <Input
                    ref={inputRef}
                    value={state.newComment}
                    onChange={handleCommentChange}
                    placeholder="Write a comment..."
                    style={{ marginTop: '8px', marginLeft: '8px', backgroundColor: '#f0f0f0' }}
                    suffix={
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={submitComment}
                        />
                    }
                />
            </div>
            <SharePost
                showShareModal={state.showShareModal}
                closeShareModal={closeShareModal}
                postId={id}
                refreshPosts={refreshPosts}
            />
        </>
    );

    return (
        <Card className="postCard" style={{ marginBottom: '16px' }}>
            {postContent}

            <Modal
                title={<div style={{ textAlign: 'center' }}>{`This post of ${username}`}</div>}
                open={state.showModal}
                onCancel={closeModal}
                footer={null}
                width={800}
                style={{ maxHeight: '600px', overflowY: 'auto' }}
            >
                <Row align="middle" style={{ marginBottom: '16px' }}>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar imgId={avatarUrl || 'https://placeholder.co/40x40'} />
                        <div style={{ marginLeft: '8px' }}>
                            <Text strong><Link to={`/profile/${ownerId}`} className="profile-link">
                                {username}
                            </Link></Text>
                            <Text type="secondary" style={{ display: 'block' }}>{parseDateTime(createdAt)}</Text>
                        </div>
                    </Col>
                </Row>
                <div className="post-split"></div>
                <Paragraph>{content}</Paragraph>
                <div className="post-split"></div>
                {Array.isArray(media) && media.length > 0 && <Slideshow images={media.map(item => item.url)} />}
                <div className="post-split"></div>
                <div className="post-actions">
                    <Reaction onReaction={handleReaction} reactions={reactions} />
                    <span onClick={focusCommentInput} className="comment-button">
                        <CommentButton>Comment</CommentButton>
                    </span>
                    <span className="share-button">
                        <ShareAltOutlined />
                        Share
                    </span>
                </div>
                <div className="post-split"></div>
                <div>
                    <Comments comments={state.comments} />
                    <Input
                        ref={inputRef}
                        value={state.newComment}
                        onChange={handleCommentChange}
                        placeholder="Write a comment..."
                        style={{ marginTop: '8px', marginLeft: '8px', backgroundColor: '#f0f0f0' }}
                        suffix={
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={submitComment}
                            />
                        }
                    />
                </div>
            </Modal>
        </Card>
    );
}

