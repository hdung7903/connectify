import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Badge, Space, List } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    MessageOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import Feed from '../../components/feed/Feed';
import PostCreate from '../../components/postCreate/postCreate';
import './home.css';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function Home() {
    const [feedKey, setFeedKey] = useState(0);
    const [newPost, setNewPost] = useState(null);
    const userId = null;
    const { user } = useAuth();
    const navigate = useNavigate();

    console.log(user.friends);

    const handleNewPost = (post) => {
        setNewPost(post);
        setFeedKey(feedKey + 1);
    };


    return (
        <Layout style={{ minHeight: '100vh', overflow: "hidden" }}>
            <Sider width={300} theme="light" style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                insetInlineStart: 0,
                top: 70,
                bottom: 0,
                scrollbarWidth: 'auto',
                scrollbarGutter: 'stable',
            }}>
                <Menu mode="inline" defaultSelectedKeys={['1']} style={{ marginTop: "10px" }}>
                    <Menu.Item key="0" icon={<Avatar size={30} icon={<UserOutlined />} />} onClick={() => navigate("/profile")}>
                        <Text level={4} style={{ margin: '0.5rem 0' }}>{user.username}</Text>
                    </Menu.Item>
                    <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => navigate("/home")}>
                        <Text level={4} style={{ margin: '0.5rem 0' }}>Home</Text>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<TeamOutlined />} onClick={() => navigate("/friends")}>
                        <Space style={{ display: 'flex', justifyContent: 'space-between', alignContent: "flex-end" }}>
                            <Text level={4} style={{ margin: '0.5rem 0' }}>Friends</Text>
                            <Badge count={user.friendNotification} overflowCount={10} color="#faad14" />
                        </Space>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<TeamOutlined />}>Groups</Menu.Item>
                    <Menu.Item key="4" icon={<MessageOutlined />}>
                        Messenger
                    </Menu.Item>
                </Menu>
            </Sider>
            <Content width={250} style={{ marginLeft: 340, marginRight: 360, padding: '1rem', overflow: 'initial' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <PostCreate onPost={handleNewPost} />
                </div>
                <Feed userId={userId} key={feedKey} newPost={newPost} />
            </Content>
            <Sider width={320} style={{
                padding: '1rem',
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                insetInlineEnd: 0,
                top: 60,
                bottom: 0,
                scrollbarWidth: 'thin',
                scrollbarGutter: 'stable',
            }}
                theme="light">
                <Title level={4}><UserOutlined /> Friends</Title>
                <Menu mode="inline">
                    {user.friends.map(friend => (
                        <Menu.Item key={friend._id}>
                            <Space onClick={() => navigate(`/profile/${friend._id}`)}>
                                <Avatar src={(friend.avatarUrl && friend.avatarUrl !== "") ? friend.avatarUrl : "http://placeholder.co/160x160"} alt="avatar" />
                                {friend.username}
                            </Space>
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
        </Layout>
    );
}