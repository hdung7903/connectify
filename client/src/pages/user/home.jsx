import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Badge, Space } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    MessageOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import Feed from '../../components/feed/Feed';
import PostCreate from '../../components/postCreate/postCreate';
import './home.css';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function Home() {
    const [feedKey, setFeedKey] = useState(0);
    const [newPost, setNewPost] = useState(null);
    const userId = null;

    const handleNewPost = (post) => {
        setNewPost(post);
        setFeedKey(feedKey + 1);
    };

    // Mock data for friends
    const friends = [
        { id: 1, name: 'Alice Johnson' },
        { id: 2, name: 'Bob Smith' },
        { id: 3, name: 'Charlie Brown' },
        { id: 4, name: 'Diana Ross' },
        { id: 5, name: 'Ethan Hunt' },
    ];

    return (
        <Layout style={{ minHeight: '100vh', overflow: "hidden" }}>
            <Sider width={380} theme="light" style={{
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
                    <Menu.Item key="0" icon={<Avatar size={30} icon={<UserOutlined />} />}>
                        <Text level={4} style={{ margin: '0.5rem 0' }}>aa</Text>
                    </Menu.Item>
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Text level={4} style={{ margin: '0.5rem 0' }}>Home</Text>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<TeamOutlined />}>
                        <Space style={{ display: 'flex', justifyContent: 'space-between', alignContent: "flex-end" }}>
                            <Text level={4} style={{ margin: '0.5rem 0' }}>Friends</Text>
                            <Badge count={11} overflowCount={10} color="#faad14" />
                        </Space>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<TeamOutlined />}>Groups</Menu.Item>
                    <Menu.Item key="4" icon={<MessageOutlined />}>
                        Messenger
                    </Menu.Item>
                </Menu>
            </Sider>
            <Content width={250} style={{ marginLeft: 380, marginRight: 380, padding: '1rem', backgroundColor: '#fff', overflow: 'initial' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <PostCreate onPost={handleNewPost} />
                </div>
                <Feed userId={userId} key={feedKey} newPost={newPost} />
            </Content>
            <Sider width={380} style={{
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
                    {friends.map(friend => (
                        <Menu.Item key={friend.id} icon={<UserOutlined />}>
                            {friend.name}
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
        </Layout>
    );
}