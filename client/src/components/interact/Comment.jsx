import React, { useEffect, useState } from 'react';
import { Row, Col, Avatar as AntAvatar, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Reaction from './Reaction';
import { Link } from 'react-router-dom';
import api from '../../services/axios';

export default function Comment({ userId, content, reactions, ownerId }) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(reactions.length);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    function likeComment() {
        setLiked(prevLiked => {
            const newCount = prevLiked ? likesCount - 1 : likesCount + 1;
            setLikesCount(newCount);
            return !prevLiked;
        });
    }

    if (loading) return <p>Loading user data...</p>;

    return (
        <div style={{ width: '100%' }}>
            <Row align="middle" style={{ marginBottom: '16px' }}>
                <Col>
                    <AntAvatar
                        icon={<UserOutlined />}
                        src={userData?.avatarUrl || 'https://placeholder.co/40x40'}
                        size="large"
                    />
                </Col>
                <Col flex="auto" style={{ marginLeft: '8px' }}>
                    <Card style={{ marginBottom: '8px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', width: '100%' }}>
                        <Card.Meta
                            title={
                                <Link to={`/profile/${ownerId}`} className="profile-link">
                                    {userData?.username || 'Anonymous'}
                                </Link>
                            }
                        />
                        <p style={{ margin: '4px 0 8px 0' }}>{content}</p>
                        <Reaction onClick={likeComment} liked={liked}>
                            {likesCount}
                        </Reaction>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
