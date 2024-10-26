import { Layout, Row, Col, Space, Typography, Badge, Popover, List, Avatar as AntAvatar, message } from 'antd';
import MyLogo from './MyLogo.jsx';
import { useEffect, useState } from 'react';
import DropdownMenu from './HeaderDropdown.jsx';
import useLoading from '../hooks/useLoading.jsx';
import { CommentOutlined, AlertOutlined } from '@ant-design/icons';
import moment from 'moment';
import Spinning from './Spinning.jsx';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

const { Header } = Layout;
const { Title } = Typography;

function HeaderComponent() {
    const { authState, logout } = useAuth();
    const [userProfile, setUserProfile] = useState({
        username: null,
        avatar: null
    });
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messagePopoverOpen, setMessagePopoverOpen] = useState(false);
    const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false);
    const { spinning, handleNavigation } = useLoading();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (authState.isAuthenticated && authState.accessToken) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${authState.accessToken}`
                        }
                    });
                    setUserProfile({
                        username: response.data.username,
                        avatar: response.data.avatar
                    });
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    setUserProfile({ username: null, avatar: null });
                }
            } else {
                setUserProfile({ username: null, avatar: null });
            }
        };

        fetchUserProfile();
    }, [authState.isAuthenticated, authState.accessToken]);


    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response.success) {
                message.success('Logged out successfully');
                setTimeout(() => {
                    handleNavigation('/login');
                }, 100);
            } else {
                message.error(response.message || 'Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            message.error('Failed to logout');
        }
    };
    useEffect(() => {
        // Simulate fetching notifications and messages from an API
        setNotifications([
            { id: 1, content: "New friend request from John", time: "2024-09-30T10:00:00Z", avatar: 'https://example.com/avatar1.png', read: false },
            { id: 2, content: "Your post got a like", time: "2024-09-30T10:00:00Z", avatar: 'https://example.com/avatar2.png', read: true },
        ]);
        setMessages([
            { id: 1, sender: "Jane", content: "Hey! How are you?", time: "2024-09-30T10:00:00Z", avatar: 'https://example.com/avatar3.png', read: false },
            { id: 2, sender: "Mark", content: "Let's catch up soon.", time: "2024-09-30T10:00:00Z", avatar: 'https://example.com/avatar4.png', read: true },
        ]);
    }, []);

    const notificationContent = (
        <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={item => (
                <List.Item style={{ cursor: 'pointer' }}>
                    <List.Item.Meta
                        avatar={<AntAvatar src={item.avatar} />}
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{item.content}</span>
                                {!item.read && <Badge dot />}
                            </div>
                        }
                        description={moment(item.time).fromNow()}
                    />
                </List.Item>
            )}
        />
    );

    const handleMessageItemClick = () => {
        setMessagePopoverOpen(false);
        handleNavigation('/message', 1000);
    };

    const messageContent = (
        <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={item => (
                <List.Item onClick={handleMessageItemClick} style={{ cursor: 'pointer' }}>
                    <List.Item.Meta
                        avatar={<AntAvatar src={item.avatar} />}
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>{item.sender}:</strong> {item.content}</span>
                                {!item.read && <Badge dot />}
                            </div>
                        }
                        description={moment(item.time).fromNow()}
                    />
                </List.Item>
            )}
        />
    );

    const handleNotificationClick = (open) => {
        if (open) {
            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({ ...notification, read: true }))
            );
        }
        setNotificationPopoverOpen(open);
    };

    const handleMessageClick = (open) => {
        if (open) {
            setMessages(prevMessages =>
                prevMessages.map(message => ({ ...message, read: true }))
            );
        }
        setMessagePopoverOpen(open);
    };

    return (
        <>
            <Spinning spinning={spinning} />
            <Header style={{ background: '#4169E1', padding: '0 50px', position: 'sticky', top: 0, zIndex: 1, height: '70px' }}>
                <Row style={{ width: '100%', height: '100%' }} align="middle" justify="space-between">
                    <Col style={{ height: '100%' }}>
                        <Space align="center" style={{ height: '90px', cursor: 'pointer' }} onClick={() => handleNavigation('/home')}>
                            <MyLogo style={{ paddingTop: "10px", alignItems: "center", display: "flex" }} />
                        </Space>
                    </Col>
                    <Col style={{ height: '100%' }}>
                        {authState.isAuthenticated && userProfile.username && (
                            <Col style={{ width: "100%" }}>
                                <Space size="large" align='start' style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Popover
                                        content={notificationContent}
                                        title="Notifications"
                                        trigger="click"
                                        placement="bottomRight"
                                        open={notificationPopoverOpen}
                                        onOpenChange={handleNotificationClick}
                                        style={{ cursor: 'pointer', background: "gray" }}
                                    >
                                        <Badge count={notifications.filter(n => !n.read).length} overflowCount={99}>
                                            <AlertOutlined style={{ fontSize: '24px', cursor: 'pointer', color: 'white' }} />
                                        </Badge>
                                    </Popover>
                                    <Popover
                                        content={messageContent}
                                        title="Messages"
                                        trigger="click"
                                        placement="bottomRight"
                                        open={messagePopoverOpen}
                                        onOpenChange={handleMessageClick}
                                    >
                                        <Badge count={messages.filter(m => !m.read).length} overflowCount={99}>
                                            <CommentOutlined style={{ fontSize: '24px', cursor: 'pointer', color: 'white' }} />
                                        </Badge>
                                    </Popover>
                                    <DropdownMenu username={userProfile.username} avatar={userProfile.avatar} handleLogout={handleLogout} />
                                </Space>
                            </Col>
                        )}
                    </Col>
                </Row>
            </Header>
        </>
    )
}

export default HeaderComponent;
