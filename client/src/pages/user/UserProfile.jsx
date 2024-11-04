import React, { useEffect, useState } from 'react';
import { Card, Avatar, Button, Row, Col, Typography, Image, Input, List, Space, message, Upload, Popover, Tabs, Modal } from 'antd';
import { UserOutlined, EditOutlined, SettingOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/axios';
import { useAuth } from '../../contexts/AuthContext';
import FriendList from '../../components/profile/FriendList';
import PostCreate from '../../components/postCreate/postCreate';
import Post from '../../components/post/Post';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const UserProfile = () => {

    const { id } = useParams();

    const { user } = useAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);

    const [avatar, setAvatar] = useState([{ url: "https://placehold.co/160x160" }]);
    const [cover, setCover] = useState([{ url: "https://placehold.co/1100x300" }]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedKey, setFeedKey] = useState(0);
    const [newPost, setNewPost] = useState(null);
    const [friendsModel, setFriendsModel] = useState(false);

    const [userPost, setUserPost] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await api.get(`/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            console.log(response.data ?? "No user found");
            setUserData(response.data.user);
            console.log(userData);
            if (response.data.user.avatarUrl || response.data.user.avatarUrl !== "") {
                setAvatar([{ url: response.data.user.avatarUrl }]);
            }
            if (response.data.user.coverUrl || response.data.user.coverUrl !== "") {
                setCover([{ url: response.data.user.coverUrl }]);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            message.error('Error fetching user');
        }
    };

    const fetchUserPost = async () => {
        try {
            const response = await api.get(`/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            console.log(response.data ?? "No user post found");
            setUserPost(response.data);
        } catch (error) {
            console.error('Error fetching user post:', error);
            message.error('Error fetching user post');
        }
    };

    useEffect(() => {
        if (id === user.userId) {
            navigate('/profile');
        } else {
            fetchUser();
            fetchUserPost();
        }
        return () => {
            console.log('cleanup');
        }
    }, [id, user._id, navigate]);


    const handleNewPost = (post) => {
        setNewPost(post);
        setFeedKey(feedKey + 1);
    };

    const handleAvatarClick = () => {
        setIsModalOpen(true);
    };

    const avatarActions = () => (
        <List
            size="small">
            <List.Item>
                <Space direction="vertical">
                    <Button icon={<PictureOutlined />} onClick={handleAvatarClick}>View Avatar</Button>
                </Space>
            </List.Item>
        </List>
    )



    return (
        <div style={{ maxWidth: 1100, margin: '20px auto' }}>

            <Card
                cover={
                    <div style={{ position: 'relative' }}>
                        <Image
                            src={`${cover[0].url}`}
                            style={{ objectFit: 'cover', height: 300, width: '100%' }}
                            preview={false}
                            alt="Cover Photo"
                        />
                    </div>
                }
                bordered={false}
            >

                <Row gutter={16} justify="center" align="middle">
                    <Col span={6} align="center" style={{ height: "100%", maxHeight: 200 }}>
                        <Popover placement="bottom" title={avatarActions}>
                            <Avatar src={avatar[0]?.url} size={160} icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                        </Popover>
                    </Col>
                    <Col xs={24} sm={16} md={18} style={{ height: "100%", minHeight: 200 }}>
                        <Title level={2}>{userData?.username}</Title>
                        <Row gutter={16} style={{ marginTop: 40 }}>
                            <Col>
                                {
                                    userPost?.relationship === "friend" ?
                                        <Button icon={<UserOutlined />}>Friend</Button> :
                                        <Button type="primary" icon={<EditOutlined />}>Add Friend</Button>
                                }
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
                        {userData?.bio && (
                            <Paragraph>{user.bio}</Paragraph>
                        )}
                        {(userData?.location.city || userData?.location.country) && (
                            <List
                                itemLayout="horizontal"
                                dataSource={[
                                    { icon: <HomeOutlined />, text: `Lives in ${city || country}` },
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
                        )}

                    </Card>
                    <FriendList friends={userData?.friends ?? []} onClick={() => setFriendsModel(true)} />
                </Col>

                {/* Right Column */}
                <Col xs={24} md={16}>
                    <div style={{ marginBottom: '1rem' }}>
                        <PostCreate onPost={handleNewPost} />
                        <div style={{ margin: "10px 0" }}>
                            {userPost?.posts?.length > 0 ? (
                                userPost?.posts.map(post => (
                                    <Post
                                        key={post._id}
                                        id={post._id}
                                        ownerId={post.ownerId}
                                        title={post.title}
                                        content={post.content}
                                        media={post.media}
                                        reactsCount={post.reactsCount}
                                        sharesCount={post.shareCount}
                                        reactions={post.reactions}
                                        visibility={post.visibility}
                                        createdAt={post.createdAt}
                                        updatedAt={post.updatedAt}
                                        username={post.username ?? userData.username}
                                        avatarUrl={post.avatarUrl}
                                        comments={post.comments}

                                    />
                                ))
                            ) : (
                                <p>No posts to display.</p>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
            >
                <img src={(!userData?.avatarUrl || userData?.avatarUrl === "") ? "http://placehold.co/160x160" : user.avatarUrl} style={{ width: "100%", height: "100%", marginTop: 30 }} />
            </Modal>
        </div>
    );
}

export default UserProfile;