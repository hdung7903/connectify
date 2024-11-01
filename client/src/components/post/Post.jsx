import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Modal, Input, Button, Typography, Skeleton, Popover, Space } from 'antd';
import Avatar from '../avatar/Avatar';
import Reaction from '../interact/Reaction';
import CommentButton from '../interact/CommentButton';
import Comments from '../interact/Comments';
import Slideshow from '../slideshow/Slideshow';
import {
    ShareAltOutlined,
    SendOutlined,
    MoreOutlined,
    UndoOutlined,
    GlobalOutlined,
    TeamOutlined,
    LockOutlined
} from '@ant-design/icons';
import './post.css';
import { Link } from 'react-router-dom';

const { Text, Paragraph } = Typography;

export default function Post(props) {
    const {
        id,
        ownerId,
        title,
        avatarUrl,
        content,
        media,
        likesCount,
        reactions,
        visibility,
        createdAt,
        updatedAt,
        username
    } = props;

    const [state, setState] = useState({
        ...props,
        showComments: false,
        commentsLoaded: false,
        comments: [],
        newComment: '',
        showModal: false,
        hidden: false,
        selectedReaction: null,
    });

    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/posts/${id}/comments`);
                const postComments = await response.json();

                setState(prevState => ({
                    ...prevState,
                    comments: postComments,
                    commentsLoaded: true
                }));
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [id]);

    const handleReaction = (reaction) => {
        const { selectedReaction } = state;

        setState(prevState => ({
            ...prevState,
            selectedReaction: selectedReaction === reaction ? null : reaction,
            likesCount: selectedReaction === reaction
                ? prevState.likesCount - 1
                : selectedReaction
                    ? prevState.likesCount
                    : prevState.likesCount + 1,
        }));
    };

    const focusCommentInput = () => {
        inputRef.current?.focus();
    };

    const handleCommentChange = (e) => {
        setState(prevState => ({
            ...prevState,
            newComment: e.target.value
        }));
    };

    const submitComment = async () => {
        if (!state.newComment.trim()) return;

        try {
            const response = await fakeData.comments.filter(comment => comment.postId === id);
            const newComment = await response.json();

            setState(prevState => ({
                ...prevState,
                comments: [...prevState.comments, newComment],
                newComment: ''
            }));
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const showAllComments = () => {
        setState(prevState => ({
            ...prevState,
            showModal: true
        }));
    };

    const closeModal = () => {
        setState(prevState => ({
            ...prevState,
            showModal: false
        }));
    };

    const parseDateTime = (time) => {
        const now = Date.now();
        const createdTime = new Date(time).getTime();
        const diffInSeconds = Math.floor((now - createdTime) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days`;
        return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    };

    const hidePost = () => {
        setState(prevState => ({
            ...prevState,
            hidden: true
        }));
    };

    const undoHidePost = () => {
        setState(prevState => ({
            ...prevState,
            hidden: false
        }));
    };

    const visibilityIcon = (visibilityType) => {
        switch (visibilityType) {
            case 'public':
                return <GlobalOutlined />;
            case 'friends':
                return <TeamOutlined />;
            case 'private':
                return <LockOutlined />;
            default:
                return <GlobalOutlined />;
        }
    };

    const postActionsMenu = (
        <div className="post-actions-menu">
            <Button type="text" onClick={hidePost} className="menu-item">Hide Post</Button>
            <Button type="text" onClick={() => alert('Post reported')} className="menu-item">
                Report Post
            </Button>
        </div>
    );

    const renderPostHeader = () => (
        <Row justify="space-between" align="middle" className="post-header">
            <Card.Meta
                avatar={
                    loading ? (
                        <Skeleton.Avatar active />
                    ) : (
                        <Avatar imgId={avatarUrl || 'https://placeholder.co/40x40'} />
                    )
                }
                title={
                    loading ? (
                        <Skeleton.Input style={{ width: 200 }} active />
                    ) : (
                        <Link to={`/profile/${ownerId}`}>{username}</Link>
                    )
                }
                description={
                    loading ? (
                        <Skeleton.Input style={{ width: 100 }} active />
                    ) : (
                        <Space>
                            <Text>{parseDateTime(createdAt)}</Text>
                            {visibilityIcon(visibility)}
                        </Space>
                    )
                }
            />
            {!loading && (
                <Popover content={postActionsMenu} trigger="click" placement="bottomRight">
                    <MoreOutlined className="more-actions" />
                </Popover>
            )}
        </Row>
    );

    const renderPostContent = () => (
        <>
            {loading ? (
                <Skeleton paragraph={{ rows: 3 }} active />
            ) : (
                <>
                    <Paragraph
                        ellipsis={{
                            rows: expanded ? undefined : 3,
                            expandable: true,
                            symbol: 'more'
                        }}
                    >
                        {content}
                    </Paragraph>
                    {Array.isArray(media) && media.length > 0 && (
                        <Slideshow images={media.map(item => item.url)} />
                    )}
                </>
            )}
        </>
    );

    const renderPostStats = () => (
        <div className="post-stats">
            {loading ? (
                <Skeleton.Input style={{ width: 200 }} active />
            ) : (
                <>
                    <Space>{state.likesCount} Reactions</Space>
                    <Space>{state.comments.length} Comments</Space>
                </>
            )}
        </div>
    );

    const renderPostActions = () => (
        !loading && (
            <div className="post-actions">
                <Reaction
                    onReaction={() => handleReaction('like')}
                    reactions={reactions}
                    selectedReaction={state.selectedReaction}
                />
                <CommentButton onClick={focusCommentInput} >Comment</CommentButton>
                <Button icon={<ShareAltOutlined />} style={{ border: "none", background: "none" }}>Share</Button>
            </div>
        )
    );

    const renderCommentSection = () => (
        !loading && (
            <div className="comment-section">
                {state.comments.length > 2 && (
                    <div className="view-all-comments" onClick={showAllComments}>
                        View all {state.comments.length} comments
                    </div>
                )}
                <Comments comments={state.comments.slice(0, 2)} />
                <div className="comment-input-container">
                    <Avatar imgId={avatarUrl} size="small" />
                    <Input
                        ref={inputRef}
                        value={state.newComment}
                        onChange={handleCommentChange}
                        placeholder="Write a comment..."
                        suffix={
                            <Button
                                icon={<SendOutlined />}
                                onClick={submitComment}
                                type="text"
                            />
                        }
                    />
                </div>
            </div>
        )
    );

    const renderHiddenPost = () => (
        <div className="post-hidden">
            <Text type="secondary">This post is hidden</Text>
            <Button icon={<UndoOutlined />} onClick={undoHidePost} type="link">
                Undo
            </Button>
        </div>
    );

    const renderCommentsModal = () => (
        <Modal
            title={`Comments on ${username}'s post`}
            open={state.showModal}
            onCancel={closeModal}
            footer={null}
            width={800}
            className="comments-modal"
        >
            <div className="modal-content">
                {renderPostContent()}
                <Comments comments={state.comments} />
                <Input.TextArea
                    rows={4}
                    value={state.newComment}
                    onChange={handleCommentChange}
                    placeholder="Write a comment..."
                />
                <Button icon={<SendOutlined />} onClick={submitComment} type="primary" block>
                    Submit Comment
                </Button>
            </div>
        </Modal>
    );

    return (
        !state.hidden && (
            <Card className="post" bordered={false}>
                {renderPostHeader()}
                {renderPostContent()}
                {renderPostStats()}
                {renderPostActions()}
                {renderCommentSection()}
                {renderCommentsModal()}
            </Card>
        )
    );
}
