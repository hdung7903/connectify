import React, { useEffect, useState } from 'react';
import { Card, Avatar, Button, Row, Col, Divider, Typography, Image, Upload, Popover, Modal, message } from 'antd';
import { UserOutlined, EditOutlined, CameraOutlined, SettingOutlined, FileImageOutlined, PictureOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import ImgCrop from 'antd-img-crop';
import PostCreate from '../../components/postCreate/postCreate';
import IntroCard from '../../components/profile/BioCard';
import FriendList from '../../components/profile/FriendList';
import api from '../../services/axios';
import Post from '../../components/post/Post';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import EditProfileModal from '../../components/modal/EditProfileModel';

const { Title } = Typography;

const OwnerProfile = () => {
    const { user } = useAuth();
    const [fileList, setFileList] = useState([]);
    const [avatar, setAvatar] = useState([{ url: user?.avatarUrl || "https://placehold.co/160x160" }]);
    const [cover, setCover] = useState([{ url: user?.coverUrl || "https://placehold.co/1100x300" }]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [userData, setUserData] = useState(user);

    const fetchPosts = async () => {
        try {
            const response = await api.get("/posts/owner", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            if (response.status === 200) setPosts(response.data);
            else message.error("No posts found");
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const uploadImageToFirebase = async (file, type) => {
        try {
            const storage = getStorage();
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `${type}/${fileName}`);
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Error uploading image to Firebase:', error);
            throw error;
        }
    };

    const updateUserImage = async (url, type) => {
        try {
            const endpoint = type === 'avatar' ? '/users/avatar' : '/users/cover';
            const response = await api.patch(endpoint, { [`${type}Url`]: url }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.status === 200) {
                message.success(`${type === 'avatar' ? 'Avatar' : 'Cover photo'} updated successfully`);
                return true;
            }
        } catch (error) {
            console.error(`Error updating ${type}:`, error);
            message.error(`Failed to update ${type}.`);
        }
        return false;
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
        return true;
    };

    const handleImageChange = async (info, type) => {
        const file = info.file.originFileObj;
        if (!file) return;
        try {
            const downloadURL = await uploadImageToFirebase(file, type);
            const success = await updateUserImage(downloadURL, type);
            if (success) {
                const newFileList = [{
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: downloadURL,
                }];

                if (type === 'avatar') {
                    setAvatar(newFileList);
                    return;
                } else {
                    setCover(newFileList);
                }
                setFileList(newFileList);
                return;
            }
        } catch (error) {
            message.error('Failed to upload image.');
        } finally {
            setUploadLoading(false);
        }
    };

    const avatarActions = () => (
        <ImgCrop showGrid quality={1} zoomSlider={false} cropShape="round" maxZoom={2.5}>
            <Upload
                showUploadList={false}
                onChange={(info) => handleImageChange(info, 'avatar')}
                beforeUpload={beforeUpload}
            >
                <Button icon={<FileImageOutlined />} loading={uploadLoading}>
                    {uploadLoading ? 'Uploading...' : 'Update Avatar'}
                </Button>
            </Upload>
            <Button icon={<PictureOutlined />} onClick={() => setIsModalOpen(true)}>
                View Avatar
            </Button>
        </ImgCrop>
    );

    const handleProfileUpdate = (updatedUser) => {
        setUserData(updatedUser);
      };

    return (
        <div style={{ maxWidth: 1100, margin: '20px auto' }}>
            <Card
                cover={
                    <div style={{ position: 'relative' }}>
                        <Image src={cover[0].url} style={{ objectFit: 'cover', height: 300, width: '100%' }} preview={false} alt="Cover Photo" />
                        <ImgCrop showGrid quality={1} zoomSlider={false} aspect={3 / 1}>
                            <Upload
                                showUploadList={false}
                                onChange={(info) => handleImageChange(info, 'cover')}
                                beforeUpload={beforeUpload}
                            >
                                <Button style={{ position: 'absolute', bottom: 16, right: 16 }} icon={<CameraOutlined />} loading={uploadLoading}>
                                    {uploadLoading ? 'Uploading...' : 'Edit Cover Photo'}
                                </Button>
                            </Upload>
                        </ImgCrop>
                    </div>
                }
            >
                <Row gutter={16} justify="center" align="middle">
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <Popover placement="bottom" content={avatarActions}>
                            <Avatar src={avatar[0].url} size={160} icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                        </Popover>
                    </Col>
                    <Col xs={24} sm={16} md={18}>
                        <Title level={2}>{user?.username}</Title>
                        <Row gutter={16} style={{ marginTop: 40 }}>
                            <Col>
                                <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditModalVisible(true)}>
                                    Edit Profile
                                </Button>
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
                    <IntroCard bio={user?.bio} city={user?.location?.city} country={user?.location?.country} />
                    <FriendList friends={user?.friends} />
                </Col>
                <Col xs={24} md={16}>
                    <PostCreate />
                    <div style={{ margin: "10px 0" }}>
                        {posts.length > 0 ? posts.map(post => (
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
                                username={post.username ?? user.username}
                                avatarUrl={post.avatarUrl ?? user.avatarUrl}
                                comments={post.comments}
                            />
                        )) : (
                            <p>No posts to display.</p>
                        )}
                    </div>
                </Col>
            </Row>

            <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={800}>
                <img src={avatar[0].url} style={{ width: "100%", height: "100%" }} alt="User Avatar" />
            </Modal>
            <EditProfileModal
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onSuccess={handleProfileUpdate}
                initialValues={userData}
            />
        </div>
    );
};

export default OwnerProfile;
