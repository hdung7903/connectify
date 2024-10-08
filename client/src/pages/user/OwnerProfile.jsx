import React, { useState } from 'react';
import { Card, Avatar, Button, Row, Col, Divider, Typography, Image, Form, Input, List, Space } from 'antd';
import { UserOutlined, EditOutlined, CameraOutlined, SettingOutlined, HomeOutlined, EnvironmentOutlined, LikeOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const OwnerProfile = () => {
    const [posts, setPosts] = useState([
        { id: 1, content: "Hello world! This is my first post.", likes: 15, comments: 3, shares: 2 },
        { id: 2, content: "Just finished a great coding session. #developerlife", likes: 24, comments: 5, shares: 1 },
    ]);

    const [newPost, setNewPost] = useState("");

    const handlePostSubmit = (values) => {
        if (values.postContent.trim()) {
            setPosts([
                { id: posts.length + 1, content: values.postContent, likes: 0, comments: 0, shares: 0 },
                ...posts
            ]);
            setNewPost("");
        }
    };

    return (
        <div style={{ maxWidth: 1100, margin: '20px auto' }}>
            {/* Cover Photo */}
            <Card
                cover={
                    <div style={{ position: 'relative' }}>
                        <Image
                            src="https://placehold.co/1100x300"
                            style={{ objectFit: 'cover', height: 300, width: '100%' }}
                            preview={false}
                        />
                        <Button
                            style={{ position: 'absolute', bottom: 16, right: 16 }}
                            icon={<CameraOutlined />}
                        >
                            Edit Cover Photo
                        </Button>
                    </div>
                }
                bordered={false}
            >
                {/* Profile Photo, Name, and Actions */}
                <Row gutter={16} justify="center" align="middle">
                    <Col span={6} align="center" style={{ height: "100%", maxHeight: 200 }}>
                        <Avatar src="https://placehold.co/160x160" size={160} icon={<UserOutlined />} />
                        <Button
                            style={{ marginTop: 16 }}
                            icon={<CameraOutlined />}
                            block
                        >
                            Change Profile Picture
                        </Button>
                    </Col>
                    <Col xs={24} sm={16} md={18} style={{ height: "100%", minHeight: 200 }}>
                        <Title level={2} style={{ marginBottom: 0 }}>John Doe</Title>
                        <Text type="secondary" style={{ fontSize: '16px' }}>@johndoe</Text>
                        <Row gutter={16} style={{ marginTop: 15 }}>
                            <Col>
                                <Button type="primary" icon={<EditOutlined />}>Edit Profile</Button>
                            </Col>
                            <Col>
                                <Button icon={<SettingOutlined />}>Account Settings</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>

            <Row gutter={16} style={{ marginTop: 20 }}>
                <Col xs={24} md={8}>
                    <Card title="Intro">
                        <Paragraph>Passionate about coding and tech.</Paragraph>
                        <Button block style={{ marginBottom: 16 }}>Edit Bio</Button>
                        <List
                            itemLayout="horizontal"
                            dataSource={[
                                { icon: <HomeOutlined />, text: 'Lives in Ha Noi' },
                                { icon: <EnvironmentOutlined />, text: 'From Ha Noi' },
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={item.icon}
                                        title={item.text}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                    <Card title={
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text strong>Friends</Text>
                            <Text type="secondary" fontSize="10px">1,000 Friends</Text>
                        </div>
                    } style={{ marginTop: 16 }}>
                        <Row gutter={[16, 16]}>
                            {[...Array(6)].map((_, index) => (
                                <Col span={8} key={index}>
                                    <Avatar shape="square" size={80} icon={<UserOutlined />} />
                                    <Text style={{ display: 'block', textAlign: 'center' }}>John Doe</Text>
                                </Col>
                            ))}
                        </Row>
                        <Button block style={{ marginTop: 16 }}>See All Friends</Button>
                    </Card>
                </Col>

                {/* Right Column */}
                <Col xs={24} md={16}>
                    <Card>
                        <Form onFinish={handlePostSubmit}>
                            <Form.Item name="postContent">
                                <TextArea
                                    rows={4}
                                    placeholder="What's on your mind?"
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>Post</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                    {posts.map(post => (
                        <Card key={post.id} style={{ marginTop: 16 }}>
                            <Space>
                                <Avatar src="https://placehold.co/40x40" size={40} icon={<UserOutlined />} />
                                <Space direction="vertical"size={4}>
                                    <Text strong style={{ marginLeft: 8 }}>John Doe</Text>
                                    <Text type="secondary" style={{ marginLeft: 8 }}>{moment("2024-09-30T10:00:00Z").fromNow()}</Text>
                                </Space>
                            </Space>
                            <Paragraph style={{ marginTop: 16 }}>{post.content}</Paragraph>
                            <Divider />
                            <Row justify="space-between">
                                <Col>
                                    <Button icon={<LikeOutlined />}>{post.likes} Like</Button>
                                </Col>
                                <Col>
                                    <Button icon={<MessageOutlined />}>{post.comments} Comment</Button>
                                </Col>
                                <Col>
                                    <Button icon={<ShareAltOutlined />}>{post.shares} Share</Button>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>
            </Row>
        </div>
    );
}

export default OwnerProfile;