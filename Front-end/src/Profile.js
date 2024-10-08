import React, { useState } from 'react';
import { } from 'react-router-dom'
import { Layout, Avatar, Card, Tabs, Row, Col, Button, Carousel, Divider, List, Typography, Input } from 'antd';
import { CameraOutlined, VideoCameraOutlined, EnvironmentOutlined, HeartOutlined, InstagramOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { LikeOutlined, SmileOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';

import 'antd'; // Make sure Ant Design styles are loaded

const { TabPane } = Tabs;
const { Content } = Layout;
const { Text } = Typography;
const { TextArea } = Input;
const ProfilePage = () => {
    const [postContent, setPostContent] = useState(''); // State to hold the post content

    const handlePostChange = (e) => {
        setPostContent(e.target.value);
    };
    const stories = [
        { id: 1, image: 'https://story1-url', name: 'Story 1' },
        { id: 2, image: 'https://story2-url', name: 'Story 2' },
        { id: 3, image: 'https://story3-url', name: 'Story 3' },
    ];

    const images = [
        { id: 1, src: 'https://image1-url' },
        { id: 2, src: 'https://image2-url' },
        { id: 3, src: 'https://image3-url' },
        { id: 4, src: 'https://image4-url' },
    ];

    return (
        <Layout style={{ backgroundColor: '#f0f2f5', padding: '20px' }}>

            {/* Header with Cover and Profile Photo */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>

                {/* Cover Photo */}
                <div style={{ height: '320px', backgroundColor: '#d9d9d9', borderRadius: '8px' }}></div>

                {/* Profile Photo */}
                <Avatar
                    size={180}
                    src="https://your-profile-photo-url"
                    style={{ position: 'absolute', bottom: '-20px', left: '20px', border: '4px solid white' }}
                />

                {/* Button to Edit Cover Photo */}
                <Button icon={<CameraOutlined />} style={{ position: 'absolute', right: '20px', bottom: '20px' }}>
                    Edit Cover Photo
                </Button>
            </div>

            {/* Profile Information */}
            <Card style={{ marginBottom: '4px' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <h2>Nguyen Tien Anh</h2>
                        <p>704 friends</p>
                        <Avatar.Group maxCount={8} size="large">
                            <Avatar src="https://friend1-photo-url" />
                            <Avatar src="https://friend2-photo-url" />
                            <Avatar src="https://friend3-photo-url" />
                        </Avatar.Group>
                    </Col>
                    <Col style={{ marginRight: '6%' }}>
                        <Button type="primary">Add to story</Button>,
                        <Button style={{ marginLeft: '10px' }}>Edit your profile</Button>
                    </Col>
                </Row>
            </Card>
            <Tabs defaultActiveKey="1">

                <TabPane tab="Article" key="1">
                    <Row gutter={16}>

                        {/* Task 1 */}
                        <Col span={8}>
                            <Card>

                                {/* Story Section */}
                                <h2>Introduce</h2>
                                <div>
                                    <Divider />
                                    <p><VideoCameraOutlined /> Studied at FPT University Hanoi</p>
                                    <p><EnvironmentOutlined /> From Vinh Phuc</p>
                                    <p><HeartOutlined /> Single</p>
                                    <p><UsergroupAddOutlined /> Has 1k followers</p>
                                    <p><InstagramOutlined /> <a href="https://instagram.com/username">Instagram</a></p>
                                    <Button type="link" block ghost
                                        style={{
                                            backgroundColor: '#d9d9d9', borderColor: '#d9d9d9', color: '#000', borderRadius: '8px', fontWeight: 'bold',
                                        }}>
                                        Edit Details
                                    </Button>
                                </div>

                                {/* Story Section */}
                                <h2>Notable Stories</h2>
                                <div>
                                    <Carousel>
                                        {stories.map((story) => (
                                            <div key={story.id}>
                                                <img
                                                    src={story.image}
                                                    alt={story.name}
                                                    style={{ width: '100%', height: '250px', borderRadius: '10px' }}
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                    <Button type="link" block ghost
                                        style={{
                                            backgroundColor: '#d9d9d9', borderColor: '#d9d9d9', color: '#000', borderRadius: '8px', fontWeight: 'bold',
                                        }}>
                                        Edit the Notable section
                                    </Button>
                                </div>

                                {/* Image Section */}
                                <Card>
                                    <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
                                        <Col>
                                            <h2>Images</h2>
                                        </Col>
                                        <Col>
                                            <Button type="link">View all photos</Button>
                                        </Col>
                                    </Row>
                                    <List
                                        grid={{ gutter: 16, column: 3 }}
                                        dataSource={images}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <img src={item.src} alt="image" style={{ width: '100%' }} />
                                            </List.Item>
                                        )}
                                    />
                                </Card>

                                {/* Friend Section */}
                                <Card>
                                    <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
                                        <Col>
                                            <h2>Friends</h2>
                                        </Col>
                                        <Col>
                                            <Button type="link">View all friends</Button>
                                        </Col>
                                    </Row>
                                    <List
                                        grid={{ gutter: 16, column: 3 }}
                                        dataSource={images}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <img src={item.src} alt="image" style={{ width: '100%' }} />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Card>
                        </Col>

                        {/* Task 2 */}
                        <Col span={16}>
                            <Card style={{ marginBottom: '10px' }}>

                                {/* Example Up Post */}
                                <Card style={{ borderRadius: '10px', marginBottom: '20px' }}>
                                    {/* Input Area for Post */}
                                    <TextArea
                                        style={{ height: '80px' }}
                                        value={postContent}
                                        onChange={handlePostChange}
                                        placeholder="What's on your mind?"
                                        rows={4} // Defines how big the text area should be
                                    />
                                    <div style={{ marginTop: '10px' }}>
                                        <Button icon={<VideoCameraOutlined />} style={{ marginRight: '10px' }}>Live Video</Button>
                                        <Button icon={<CameraOutlined />}>Photo/Video</Button>
                                    </div>
                                </Card>

                                {/* Example Post */}
                                <Card>
                                    <Row justify="start" align="middle">
                                        {/* Avatar của người đăng */}
                                        <Avatar
                                            size={50}
                                            src="https://profile-photo-url" // URL ảnh đại diện
                                            style={{ marginRight: '10px' }}
                                        />
                                        <Col>
                                            {/* Tên người đăng và thời gian */}
                                            <h4 style={{ marginBottom: '0px' }}>Nguyen Tien Anh</h4>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                14 tháng 2 · 😍 {/* Thời gian đăng bài và biểu tượng cảm xúc */}
                                            </Text>
                                        </Col>
                                    </Row>

                                    {/* Nội dung bài đăng */}
                                    <p style={{ marginTop: '10px' }}>😎</p>

                                    {/* Hình ảnh trong bài đăng */}
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <img src="https://image1-url" alt="Post" style={{ width: '100%', borderRadius: '8px' }} />
                                        </Col>
                                        <Col span={12}>
                                            <img src="https://image2-url" alt="Post" style={{ width: '100%', borderRadius: '8px' }} />
                                        </Col>
                                        <Col span={12}>
                                            <img src="https://image3-url" alt="Post" style={{ width: '100%', borderRadius: '8px' }} />
                                        </Col>
                                        <Col span={12}>
                                            <img src="https://image4-url" alt="Post" style={{ width: '100%', borderRadius: '8px' }} />
                                        </Col>
                                    </Row>

                                    {/* Tương tác: Lượt thích, bình luận */}
                                    <Divider />
                                    <Row justify="space-between">
                                        <Col>
                                            <span style={{ fontSize: '14px' }}>
                                                <LikeOutlined style={{ color: '#1890ff', marginRight: '5px' }} />
                                                <HeartOutlined style={{ color: 'red', marginRight: '5px' }} />
                                                <SmileOutlined style={{ color: '#ffc107', marginRight: '5px' }} />
                                                You, Tan Phat, Nguyen Hoang Dung and 114 others
                                            </span>
                                        </Col>
                                        <Col>
                                            <Text type="secondary">105 reviews</Text>
                                        </Col>
                                    </Row>

                                    <Divider />

                                    {/* Hành động: Merchants, Comment, Share */}
                                    <Row justify="space-around" align="middle">
                                        <Button type="link" icon={<LikeOutlined style={{ fontSize: '20px' }} />}>
                                            Merchants
                                        </Button>
                                        <Button type="link" icon={<MessageOutlined style={{ fontSize: '20px' }} />}>
                                            Comment
                                        </Button>
                                        <Button type="link" icon={<ShareAltOutlined style={{ fontSize: '20px' }} />}>
                                            Share
                                        </Button>
                                    </Row>
                                </Card>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane tab="Introduce" key="2">
                    <Card>
                        <h2>Introduce</h2>
                        <Divider />
                        <p><VideoCameraOutlined /> Studied at FPT University Hanoi</p>
                        <p><EnvironmentOutlined /> From Vinh Phuc</p>
                        <p><HeartOutlined /> Single</p>
                        <p><UsergroupAddOutlined /> Has 339 followers</p>
                        <p><InstagramOutlined /> <a href="https://instagram.com/username">Instagram</a></p>
                    </Card>
                </TabPane>

                <TabPane tab="Friends" key="3">
                    <h3>Friends List</h3>
                </TabPane>

                <TabPane tab="Images" key="4">
                    <h3>Images</h3>
                </TabPane>
            </Tabs>
        </Layout>
    );
};

export default ProfilePage;
