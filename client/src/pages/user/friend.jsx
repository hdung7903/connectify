import React, { act, useState } from 'react';
import { Input, List, Button, Card, Typography, Row, Col, Space, Avatar } from 'antd';
import { UserOutlined, UserAddOutlined, UsergroupAddOutlined, SearchOutlined } from '@ant-design/icons';
import './AddFriend.css';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const AddFriend = () => {
    const [activeTab, setActiveTab] = useState('1');

    const renderFriendItem = (name, mutualFriends, imageSrc, buttons, key) => (
        <List.Item key={key}>
            <Card style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size={80} src={imageSrc} icon={<UserOutlined />} />
                    <div style={{ marginLeft: '16px', flex: 1 }}>
                        <Link to={`/profile/1`} className="profile-link">
                            {`${name}`}
                        </Link>
                        <div>
                            <Text type="secondary">{mutualFriends} mutual friends</Text>
                        </div>
                        <Space style={{ marginTop: '8px' }}>
                            {buttons.map((button, index) => React.cloneElement(button, { key: index }))}
                        </Space>
                    </div>
                </div>
            </Card>
        </List.Item>
    );

    const friendRequests = [
        { id: 'fr1', name: 'John Doe', mutualFriends: 5, imageSrc: 'https://placeholder.co/80x80' },
        { id: 'fr2', name: 'Jane Smith', mutualFriends: 3, imageSrc: 'https://placeholder.co/80x80' },
    ];

    const suggestions = [
        { id: 's1', name: 'Alice Johnson', mutualFriends: 8, imageSrc: 'https://placeholder.co/80x80' },
        { id: 's2', name: 'Bob Williams', mutualFriends: 2, imageSrc: 'https://placeholder.co/80x80' },
    ];

    const friends = [
        { id: 'f1', name: 'Emily Brown', mutualFriends: 15, imageSrc: 'https://placeholder.co/80x80' },
        { id: 'f2', name: 'Michael Davis', mutualFriends: 7, imageSrc: 'https://placeholder.co/80x80' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case '1':
                return (
                    <List
                        itemLayout="vertical"
                        dataSource={friendRequests}
                        renderItem={(item) => renderFriendItem(
                            item.name,
                            item.mutualFriends,
                            item.imageSrc,
                            [
                                <Button type="primary">Confirm</Button>,
                                <Button>Delete</Button>
                            ],
                            item.id
                        )}
                    />
                );
            case '2':
                return (
                    <List
                        itemLayout="vertical"
                        dataSource={suggestions}
                        renderItem={(item) => renderFriendItem(
                            item.name,
                            item.mutualFriends,
                            item.imageSrc,
                            [
                                <Button type="primary" icon={<UserAddOutlined />}>Add Friend</Button>,
                                <Button>Remove</Button>
                            ],
                            item.id
                        )}
                    />
                );
            case '3':
                return (
                    <List
                        itemLayout="vertical"
                        dataSource={friends}
                        renderItem={(item) => renderFriendItem(
                            item.name,
                            item.mutualFriends,
                            item.imageSrc,
                            [
                                <Button type="primary">Message</Button>,
                                <Button danger>Unfriend</Button>
                            ],
                            item.id
                        )}
                    />
                );
            default:
                return null;
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
                            { icon: <UserAddOutlined />, text: 'Friend Requests', key: '1' },
                            { icon: <UsergroupAddOutlined />, text: 'Suggestions', key: '2' },
                            { icon: <UserOutlined />, text: 'All Friends', key: '3' },
                        ]}
                        renderItem={(item) => (
                            <List.Item
                                key={item.key}
                                onClick={() => setActiveTab(item.key)}
                                style={{ cursor: 'pointer', backgroundColor: activeTab === item.key ? '#e6f7ff' : 'transparent' }}
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
                {
                    activeTab === '3' && (
                        <Card
                            title={<Input prefix={<SearchOutlined />} placeholder="Search Friends" />}
                            style={{ marginBottom: '16px' }}
                        />
                    )
                }
                <Card>
                    <Title level={4}>
                        {activeTab === '1' ? 'Friend Requests' : activeTab === '2' ? 'Suggestions' : 'All Friends'}
                    </Title>
                    {renderContent()}
                </Card>
            </Col>
        </Row>
    );
};

export default AddFriend;