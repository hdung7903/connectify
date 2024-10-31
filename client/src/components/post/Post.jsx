import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Modal, Input, Button, Popover, Typography } from 'antd';
import Avatar from '../avatar/Avatar';
import Reaction from '../interact/Reaction';
import CommentButton from '../interact/CommentButton';
import Comments from '../interact/Comments';
import Slideshow from '../slideshow/Slideshow';
import { ShareAltOutlined, SendOutlined, MoreOutlined, UndoOutlined } from '@ant-design/icons';
import './post.css';
import { Link, useNavigate } from 'react-router-dom';

const { Text, Paragraph } = Typography;

export default function Post(props) {
    const { id, ownerId, title, avatarUrl, content, media, likesCount, reactions, visibility, createdAt, updatedAt, username } = props;
    const navigate = useNavigate();

    const [state, setState] = useState({
        ...props,
        showComments: false,
        commentsLoaded: false,
        comments: [],
        newComment: '',
        showModal: false,
        hidden: false,
    });

    const [expanded, setExpanded] = useState(true);
    const inputRef = useRef(null);

    // Fetch comments related to the post
    useEffect(() => {
        const fetchComments = async () => {
            const postComments = await fakeData.comments.filter(comment => comment.postId === id);
            setState(prevState => ({
                ...prevState,
                comments: postComments,
                commentsLoaded: true
            }));
        };

        fetchComments();
    }, [id]);

    function handleReaction(reaction) {
        const { selectedReaction, likesCount } = state;

        if (selectedReaction === reaction) {
            setState(prevState => ({
                ...prevState,
                selectedReaction: null,
                likesCount: prevState.likesCount - 1,
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                selectedReaction: reaction,
                likesCount: selectedReaction ? prevState.likesCount : prevState.likesCount + 1,
            }));
        }
    }

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

    function submitComment() {
        if (state.newComment.trim()) {
            const newComment = {
                id: state.comments.length + 1,
                userId: 'user-id', // Replace with actual user ID
                content: state.newComment,
                reactions: [],
            };

            setState(prevState => ({
                ...prevState,
                comments: [...prevState.comments, newComment],
                newComment: ''
            }));
        }
    }

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
                <Card.Meta
                    avatar={<Avatar imgId={avatarUrl || 'https://placeholder.co/40x40'} />}
                    title={
                        <Link to={`/profile/${ownerId}`} className="profile-link">
                            {username} {/* Ensure username is passed correctly */}
                        </Link>
                    }
                    description={<div className="post-time">{parseDateTime(createdAt)}</div>}
                />
                <Popover content={postActionsMenu} trigger="click">
                    <MoreOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                </Popover>
            </Row>
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
                </Col>
            </Row>
            <div className="post-stats">
                <div className="post-stats-left">{likesCount} reactions</div>
                <div className="post-stats-right">{state.comments.length} comments</div>
            </div>
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
                {state.comments.length > 2 && (
                    <div className="view-all-comments" onClick={showAllComments}>
                        View all comments
                    </div>
                )}
                {state.comments.length > 0 ? (
                    <Comments comments={state.comments.slice(0, 2)} />
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
                    <Col>
                        <Avatar imgId={avatarUrl} />
                        <Text strong style={{ marginLeft: '8px' }}>{username}</Text>
                        <Text type="secondary" style={{ marginLeft: '8px' }}>{parseDateTime(createdAt)}</Text>
                    </Col>
                </Row>
                <Paragraph>{content}</Paragraph>
                {Array.isArray(media) && media.length > 0 && <Slideshow images={media.map(item => item.url)} />}
                <div>
                    <Comments comments={state.comments} />
                    <Input.TextArea
                        rows={4}
                        value={state.newComment}
                        onChange={handleCommentChange}
                        placeholder="Add a comment..."
                    />
                    <Button type="primary" onClick={submitComment} style={{ marginTop: '8px' }}>
                        Submit Comment
                    </Button>
                </div>
            </Modal>
        </Card>
    );
}
