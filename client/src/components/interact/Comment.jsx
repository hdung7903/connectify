import React, { useEffect, useState } from 'react';
import { Row, Col, Avatar as AntAvatar, Card, Input, Button } from 'antd';
import { UserOutlined, CommentOutlined } from '@ant-design/icons';
import Reaction from './Reaction';
import { Link } from 'react-router-dom';
import api from '../../services/axios';

export default function Comment({ userId, content, reactions, ownerId, parentCommentId, postId, replies }) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(reactions?.length || 0);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replyList, setReplyList] = useState(replies || []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/posts/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                setUserData(response.data);
            } catch (error) {
                console.error(`Error fetching user data for userId ${userId}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const likeComment = () => {
        setLiked(prevLiked => {
            const newCount = prevLiked ? likesCount - 1 : likesCount + 1;
            setLikesCount(newCount);
            return !prevLiked;
        });
    };

    const handleReply = async () => {
        try {
            const response = await api.post(
                `/posts/reply`,
                { parentCommentId, content: replyContent, postId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );
            setReplyList([...replyList, response.data]);
            setReplyContent('');
            setShowReplyInput(false);
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    if (loading) return <p>Loading user data...</p>;

    return (
        <div style={{ width: '100%' }}>
            <Row align="middle" style={{ marginBottom: '16px' }}>
                <Col flex="auto">
                    <Card
                        style={{
                            marginBottom: '8px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                            border: '1px solid #e0e0e0',
                            display: 'flex',
                            flexDirection: 'column', // Keep content in column for parent card
                        }}
                    >
                        {/* Avatar and username in same row */}
                        <Row align="middle" style={{ marginBottom: '8px' }}>
                            <Col>
                                <AntAvatar
                                    icon={<UserOutlined />}
                                    src={userData?.avatarUrl || 'https://placeholder.co/40x40'}
                                    size="large"
                                    style={{
                                        marginRight: '12px',
                                        marginLeft: '4px',
                                    }}
                                />
                            </Col>
                            <Col>
                                <Card.Meta
                                    title={
                                        <Link to={`/profile/${ownerId}`} className="profile-link">
                                            {userData?.username || 'Anonymous'}
                                        </Link>
                                    }
                                />
                            </Col>
                        </Row>

                        <div style={{ marginTop: '8px' }}>
                            <p style={{ margin: '4px 0 8px 0' }}>{content}</p>
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Reaction onClick={likeComment} liked={liked}>
                                        {likesCount}
                                    </Reaction>
                                </Col>
                                <Button type="link" icon={<CommentOutlined />} onClick={() => setShowReplyInput(!showReplyInput)}>
                                    Reply
                                </Button>
                            </Row>
                            {showReplyInput && (
                                <div style={{ marginTop: '8px' }}>
                                    <Input
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Write a reply..."
                                        onPressEnter={handleReply}
                                    />
                                    <Button type="primary" onClick={handleReply} style={{ marginTop: '8px' }}>
                                        Submit Reply
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Replies - No border for individual replies */}
                    {replyList.map((reply) => (
                        <div key={reply._id} style={{ paddingLeft: '32px', marginTop: '8px' }}>
                            <Comment
                                userId={reply.userId}
                                content={reply.content}
                                avatarUrl={reply.avatarUrl}
                                parentCommentId={reply._id}
                                postId={postId}
                                reactions={reply.reactions}
                                replies={reply.replies}
                            />
                        </div>
                    ))}
                </Col>
            </Row>
        </div>
    );
}