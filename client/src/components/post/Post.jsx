import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Modal, Input, Button } from 'antd';
import Avatar from '../avatar/Avatar';
import Reaction from '../interact/Reaction';
import CommentButton from '../interact/CommentButton';
import Comments from '../interact/Comments';
import Slideshow from '../slideshow/Slideshow';
import { ShareAltOutlined, SendOutlined } from '@ant-design/icons';
import './post.css';
import fakeData from '../feed/fakeData.json';
import { Link } from 'react-router-dom';

export default function Post(props) {
    const { id, avatar, text, images, likes_num, liked, created_at, first_name, last_name } = props;

    const [state, setState] = useState({
        ...props,
        showComments: false,
        commentsLoaded: false,
        comments: [],
        newComment: '',
        showModal: false,
    });

    const inputRef = useRef(null);

    useEffect(() => {
        const postComments = fakeData.comments.filter(comment => comment.postId === id);
        setState(prevState => ({
            ...prevState,
            comments: postComments,
            commentsLoaded: true
        }));
    }, [id]);

    function handleReaction(reaction) {
        const { selectedReaction, likes_num } = state;

        if (selectedReaction === reaction) {
            setState(prevState => ({
                ...prevState,
                selectedReaction: null,
                likes_num: prevState.likes_num - 1,
            }));
        } else if (selectedReaction && selectedReaction !== reaction) {
            setState(prevState => ({
                ...prevState,
                selectedReaction: reaction,
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                selectedReaction: reaction,
                likes_num: prevState.likes_num + 1,
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
                postId: id,
                first_name: 'User',
                last_name: 'Test',
                comment: state.newComment,
                likes_num: 0,
                avatar: null,
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

    return (
        <Card className="postCard" style={{ marginBottom: '16px' }}>
            <Card.Meta
                avatar={<Avatar imgId={avatar || 'https://placeholder.co/40x40'} />}
                title={
                    <Link to={`/profile/1`} className="profile-link">
                        {`${first_name} ${last_name}`}
                    </Link>
                }
            />
            <Row>
                <Col span={24}>
                    <p>{state.text}</p>
                    {Array.isArray(state.images) && <Slideshow images={state.images} />}
                </Col>
            </Row>
            <div className="post-stats">
                <div className="post-stats-left">{state.likes_num} reactions</div>
                <div className="post-stats-right">{state.comments.length} comments</div>
            </div>
            <div className="post-split"></div>
            <div className="post-actions">
                <Reaction onReaction={handleReaction} />
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
                <Avatar imgId={avatar} />
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
            <Modal
                title="All Comments"
                open={state.showModal}
                onCancel={closeModal}
                footer={null}
            >
                <Comments comments={state.comments} />
            </Modal>
        </Card>
    );
}
