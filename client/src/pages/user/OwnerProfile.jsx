import React, { useEffect, useState } from 'react';
import { Card, Avatar, Button, Row, Col, Divider, Typography, Image, Form, Input, List, Space, Upload, Popover, Modal, Tabs, message } from 'antd';
import { UserOutlined, EditOutlined, CameraOutlined, SettingOutlined, HomeOutlined, EnvironmentOutlined, LikeOutlined, MessageOutlined, ShareAltOutlined, FileImageOutlined, PictureOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import ImgCrop from 'antd-img-crop';
import PostCreate from '../../components/postCreate/postCreate';
import Feed from '../../components/feed/Feed';
import IntroCard from '../../components/profile/BioCard';
import FriendList from '../../components/profile/FriendList';
import api from '../../services/axios';
import Post from '../../components/post/Post';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const tabs = [
    {
        key: "1",
        label: "Posts",
    },
    {
        key: "2",
        label: "About",
    },
    {
        key: "3",
        label: "Friends",
    },
    {
        key: "4",
        label: "Photos",
    }

];

const OwnerProfile = () => {

    const { user } = useAuth();
    console.log(user);


    const [avatar, setAvatar] = useState((user.avatarUrl || user.avatarUrl !== "") ? [{ url: user.avatarUrl }] : [{ url: "https://placehold.co/160x160" }]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cover, setCover] = useState((user.coverUrl || user.coverUrl !== "") ? [{ url: user.coverUrl }] : [{ url: "https://placehold.co/1100x300" }]);
    const [feedKey, setFeedKey] = useState(0);
    const [newPost, setNewPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const response = await api.get("/posts/owner", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.status === 200) {
                console.log("Posts found", response.data);
                setPosts(response.data);
            } else {
                console.log("No posts found", response);
                message.error("No posts found");
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleNewPost = (post) => {
        setNewPost(post);
        setFeedKey(feedKey + 1);
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error(`${file.name} is not an image file`);
            return Upload.LIST_IGNORE;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB!');
            return Upload.LIST_IGNORE;
        }

        const fileExists = fileList.some(existingFile => existingFile.name === file.name && existingFile.size === file.size);
        if (fileExists) {
            return Upload.LIST_IGNORE;
        }

        setFileList(prevList => [...prevList, {
            uid: file.uid,
            name: file.name,
            status: 'done',
            url: URL.createObjectURL(file),
            originFileObj: file
        }]);
        return false;
    };

    const handleImageChange = ({ fileList }) => {
        const files = fileList.map(file => file.originFileObj);
        handleChange({ name: 'img', value: files });
        setAvatar(fileList);
    };

    const handleRemove = (file) => {
        setAvatar(prevList => prevList.filter(item => item.uid !== file.uid));
        const updatedImages = values.img.filter(img => img !== file.originFileObj);
        setValues({ ...values, img: updatedImages });
    };

    const handleAvatarClick = () => {
        setIsModalOpen(true);
    };

    const avatarActions = () => (
        <List
            size="small">
            <List.Item>
                <Space direction="vertical">
                    <ImgCrop showGrid quality={1} zoomSider={false} cropShape='round' maxZoom={2.5}>
                        <Upload
                            name="avatar"
                            className="avatar-uploader"
                            showUploadList={false}
                            onChange={handleImageChange}
                            onRemove={handleRemove}
                        >
                            <Button icon={<FileImageOutlined />}>Update Avatar</Button>
                        </Upload>
                    </ImgCrop>
                    <Button icon={<PictureOutlined />} onClick={handleAvatarClick}>View Avatar</Button>
                </Space>
            </List.Item>
        </List>
    )

    console.log(posts);

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
                        <ImgCrop showGrid quality={1} zoomSider={false} aspect={3 / 1}>
                            <Upload
                                name="cover"
                                className="cover-uploader"
                                showUploadList={false}
                                onChange={handleImageChange}
                                onRemove={handleRemove}
                            >
                                <Button
                                    style={{ position: 'absolute', bottom: 16, right: 16 }}
                                    icon={<CameraOutlined />}
                                >
                                    Edit Cover Photo
                                </Button>
                            </Upload>
                        </ImgCrop>
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
                        <Title level={2}>{user.username}</Title>
                        <Row gutter={16} style={{ marginTop: 40 }}>
                            <Col>
                                <Button type="primary" icon={<EditOutlined />}>Edit Profile</Button>
                            </Col>
                            <Col>
                                <Button icon={<SettingOutlined />}>Account Settings</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Tabs defaultActiveKey="1" type="card" style={{ marginTop: 20 }} items={tabs} />
            </Card>

            <Row gutter={16} style={{ marginTop: 20 }}>
                <Col xs={24} md={8}>
                    <IntroCard bio={user.bio} city={user.location.city} country={user.location.country} />
                    <FriendList friends={user.friends} />
                </Col>

                {/* Right Column */}
                <Col xs={24} md={16}>
                    <div style={{ marginBottom: '1rem' }}>
                        <PostCreate onPost={handleNewPost} />
                        <div style={{ margin: "10px 0" }}>
                            {posts?.length > 0 ? (
                                posts.map(post => (
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
                                        username={post.username??user.username}
                                        avatarUrl={post.avatarUrl}
                                        comments={post.comments}
                                        // refreshPosts={refreshPosts}

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
                <img src={(!user.avatarUrl || user.avatarUrl === "") ? "http://placehold.co/160x160" : user.avatarUrl} style={{ width: "100%", height: "100%", marginTop: 30 }} />
            </Modal>
        </div>
    );
}

export default OwnerProfile;