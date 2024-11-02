import React, { useEffect, useState } from 'react';
import { Card, Avatar, Button, Row, Col, Divider, Typography, Image, Form, Input, List, Space, message, Upload, Popover, Tabs, Modal } from 'antd';
import { UserOutlined, EditOutlined, CameraOutlined, SettingOutlined, FileImageOutlined, PictureOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/axios';
import { useAuth } from '../../contexts/AuthContext';
import ImgCrop from 'antd-img-crop';
import IntroCard from '../../components/profile/BioCard';
import FriendList from '../../components/profile/FriendList';
import PostCreate from '../../components/postCreate/postCreate';
import Feed from '../../components/feed/Feed';

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

    useEffect(() => {
        if (id === user.userId) {
            navigate('/profile');
        } else {
            fetchUser();
        }
        return () => {
            console.log('cleanup');
        }
    }, [id, user._id, navigate]);


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
                        <Title level={2}>{userData?.username}</Title>
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
                    <IntroCard bio={userData?.bio} city={userData?.location.city} country={userData?.location.country} />
                    <FriendList friends={userData?.friends ?? []} />
                </Col>

                {/* Right Column */}
                <Col xs={24} md={16}>
                    <div style={{ marginBottom: '1rem' }}>
                        <PostCreate onPost={handleNewPost} />
                        <Feed userId={userData?._id} key={feedKey} newPost={newPost} />
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