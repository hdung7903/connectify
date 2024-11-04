import React, { useEffect, useState } from 'react';
import { Input, List, Button, Card, Typography, Row, Col, Space, Avatar, message, Badge } from 'antd';
import { UserOutlined, UserAddOutlined, UsergroupAddOutlined, SearchOutlined } from '@ant-design/icons';
import './AddFriend.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/axios';

const { Title, Text } = Typography;

const AddFriend = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('1');
    const [suggestionFriends, setSuggestionFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasMore: false
    });

    const fetchSuggestions = async () => {
        try {
            const response = await api.get('/friends/suggestions', {
                params: {
                    page: pagination.currentPage,
                    limit: 10
                }
            });
            setSuggestionFriends(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            message.error('Failed to fetch friend suggestions');
            setSuggestionFriends([]);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await api.get('/friends/requests', {
                params: {
                    page: pagination.currentPage,
                    limit: 10
                }
            });
            setFriendRequests(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching requests:', error);
            message.error('Failed to fetch friend requests');
            setFriendRequests([]);
        }
    };

    const fetchSentRequests = async () => {
        try {
            const response = await api.get('/friends/sent-requests', {
                params: {
                    page: pagination.currentPage,
                    limit: 10
                }
            });
            setSentRequests(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching sent requests:', error);
            message.error('Failed to fetch sent requests');
            setSentRequests([]);
        }
    };

    const fetchFriendsList = async () => {
        try {
            const response = await api.get('/friends/list', {
                params: {
                    page: pagination.currentPage,
                    limit: 10,
                    search: searchQuery
                },
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setFriends(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching friends list:', error);
            message.error('Failed to fetch friends list');
            setFriends([]);
        }
    };

    useEffect(() => {
        fetchFriendsList();
    }, [user]);

    useEffect(() => {
        switch (activeTab) {
            case '1':
                fetchRequests();
                break;
            case '2':
                fetchSuggestions();
                break;
            case '3':
                fetchSentRequests();
                break;
            case '4':
                fetchFriendsList();
                break;
        }
    }, [activeTab, pagination.currentPage]);

    useEffect(() => {
        if (activeTab === '4') {
            fetchFriendsList();
        }
    }, [searchQuery]);

    const handleAcceptRequest = async (requesterId) => {
        try {
            await api.post('/friends/accept-request', { requesterId }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            message.success('Friend request accepted');
            fetchRequests();
            fetchFriendsList();
        } catch (error) {
            console.error('Error accepting friend request:', error);
            message.error('Failed to accept friend request');
        }
    };

    const handleRejectRequest = async (requesterId) => {
        try {
            await api.post('/friends/reject-request', { requesterId }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            message.success('Friend request rejected');
            fetchRequests();
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            message.error('Failed to reject friend request');
        }
    };

    const handleSendRequest = async (recipientId) => {
        try {
            await api.post('/friends/send-request', { recipientId }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            message.success('Friend request sent');
            fetchSuggestions();
            fetchSentRequests();
        } catch (error) {
            console.error('Error sending friend request:', error);
            message.error('Failed to send friend request');
        }
    };

    const handleCancelRequest = async (recipientId) => {
        try {
            await api.post('/friends/cancel-request', { recipientId }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            message.success('Friend request cancelled');
            fetchSentRequests();
            fetchSuggestions();
        } catch (error) {
            console.error('Error cancelling friend request:', error);
            message.error('Failed to cancel friend request');
        }
    };

    const handleUnfriend = async (friendId) => {
        try {
            await api.post('/friends/unfriend', { friendId }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            message.success('Unfriended successfully');
            fetchFriendsList();
            fetchSuggestions();
        } catch (error) {
            console.error('Error unfriending:', error);
            message.error('Failed to unfriend');
        }
    };

    const renderFriendItem = (item) => (
        <List.Item key={item._id}>
            <Card style={{ width: '100%', padding: '12px' }}>
                <Space style={{ display: 'flex' }} >
                    <Avatar
                        size={80}
                        src={item.avatarUrl}
                        icon={!item.avatarUrl && <UserOutlined />}
                    />
                    <Space style={{ marginLeft: '16px', flex: 1 }} direction='vertical'>
                        <Link to={`/profile/${item._id}`} className="profile-link">
                            <Text strong>{item.username}</Text>
                        </Link>
                        {item.bio && <Text style={{ display: 'block', margin: '4px 0' }}>{item.bio}</Text>}
                        <Space style={{ marginTop: '8px' }}>
                            {activeTab === '1' && (
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={() => handleAcceptRequest(item._id)}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        onClick={() => handleRejectRequest(item._id)}
                                    >
                                        Reject
                                    </Button>
                                </Space>
                            )}
                            {activeTab === '2' && (
                                <Space direction='vertical'>
                                    <Button
                                        type="primary"
                                        icon={<UserAddOutlined />}
                                        onClick={() => handleSendRequest(item._id)}
                                    >
                                        Add Friend
                                    </Button>
                                </Space>
                            )}
                            {activeTab === '3' && (
                                <Space direction='vertical'>
                                    <Button
                                        onClick={() => handleCancelRequest(item._id)}
                                    >
                                        Cancel Request
                                    </Button>
                                </Space>
                            )}
                            {activeTab === '4' && (
                                <Space direction='vertical'>
                                    <Button
                                        danger
                                        onClick={() => handleUnfriend(item._id)}
                                    >
                                        Unfriend
                                    </Button>
                                </Space>
                            )}
                        </Space>
                    </Space>
                </Space>
            </Card>
        </List.Item>
    );

    const getDataSource = () => {
        switch (activeTab) {
            case '1':
                return friendRequests;
            case '2':
                return suggestionFriends;
            case '3':
                return sentRequests;
            case '4':
                return friends;
            default:
                return [];
        }
    };

    return (
        <Row gutter={[16, 16]} style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Col xs={24} sm={8} md={6} lg={5} xl={4}>
                <Card>
                    <Title level={4}>Friends</Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={[
                            {
                                icon: <UserAddOutlined />, text: (
                                    <Space>
                                        <Text>Friend Requests</Text>
                                        <Badge count={friendRequests.length}></Badge>
                                    </Space>
                                ), key: '1'
                            },
                            { icon: <UsergroupAddOutlined />, text: (
                                <Space>
                                        <Text> Suggestions</Text>
                                </Space>                             
                            ), key: '2' },
                            { icon: <UserAddOutlined />, text: 'Sent Requests', key: '3' },
                            { icon: <UserOutlined />, text: 'All Friends', key: '4' },
                        ]}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => setActiveTab(item.key)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: activeTab === item.key ? '#e6f7ff' : 'transparent',
                                    padding: '8px 16px',
                                    borderRadius: '4px'
                                }}
                            >
                                <Space>
                                    {item.icon}
                                    <Text>{item.text}</Text>
                                </Space>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={16} md={18} lg={19} xl={20}>
                {activeTab === '4' && (
                    <Card style={{ marginBottom: '16px' }}>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search Friends"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                        />
                    </Card>
                )}
                <Card>
                    <Title level={4}>
                        {activeTab === '1' ? 'Friend Requests' :
                            activeTab === '2' ? 'Suggestions' :
                                activeTab === '3' ? 'Sent Requests' :
                                    'All Friends'}
                    </Title>
                    <List
                        itemLayout="vertical"
                        dataSource={getDataSource()}
                        renderItem={renderFriendItem}
                        pagination={pagination.totalPages > 1 ? {
                            current: pagination.currentPage,
                            total: pagination.totalItems,
                            pageSize: 10,
                            onChange: (page) => setPagination(prev => ({ ...prev, currentPage: page }))
                        } : false}
                        locale={{ emptyText: 'No data available' }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default AddFriend;