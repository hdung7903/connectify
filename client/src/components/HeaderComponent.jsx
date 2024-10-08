import { Layout, Row, Col, Space, Typography, Badge, Popover, List, Avatar as AntAvatar, message } from 'antd';
import MyLogo from './MyLogo.jsx';
import { useEffect, useState } from 'react';
import DropdownMenu from './HeaderDropdown.jsx';
import useLoading from '../hooks/useLoading.jsx';
const { Header } = Layout;
const { Title } = Typography;
import { CommentOutlined, AlertOutlined } from '@ant-design/icons';
import moment from 'moment';
import Spinning from './Spinning.jsx';

function HeaderComponent() {
    const [auth, setAuth] = useState(localStorage.getItem("auth") === "true");
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messagePopoverOpen, setMessagePopoverOpen] = useState(false);
    const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false);

    const { spinning, handleNavigation } = useLoading();

    useEffect(() => {
        const handleStorageChange = () => {
            setAuth(localStorage.getItem("auth") === "true");
            setUsername(localStorage.getItem("username"));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        handleNavigation('/login', 1000);
        setTimeout(() => {
            localStorage.removeItem("auth");
            localStorage.removeItem("username");
            message.success('Logged out successfully');
            setAuth(false);
            setUsername(null);
        }, 1000);
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
            <Header style={{ background: '#4169E1', padding: '0 50px', position: 'sticky', top: 0, zIndex: 1, height: '64px' }}>
                <Row style={{ width: '100%', height: '100%' }} align="middle" justify="space-between">
                    <Col style={{ height: '100%' }}>
                        <Space align="start " style={{ height: '100%', cursor: 'pointer' }} onClick={() => handleNavigation('/home')}>
                            <MyLogo style={{ paddingTop: "10px", alignItems: "center", display:"flex" }} />
                        </Space>
                    </Col>
                    <Col style={{ height: '100%' }}>
                        {auth && username && (
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
                                    <DropdownMenu username={username} handleLogout={handleLogout} />
                                </Space>
                            </Col>
                        )}
                    </Col>
                </Row>
            </Header>
        </>
    )
}

export default HeaderComponent