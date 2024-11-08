import React, { useEffect, useState } from 'react';
import { Card, Input, Upload, Button, message, Dropdown, Space, Divider, Modal } from 'antd';
import { DownOutlined, GlobalOutlined, LockOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import Avatar from '../avatar/Avatar';
import './postCreate.css';
import useForm from '../../hooks/useForm';
import api from '../../services/axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { formatContent } from '../../utils/linkFormatter';

const VISIBILITY_OPTIONS = {
    PUBLIC: 'public',
    FRIENDS: 'friends',
    PRIVATE: 'private'
};

const items = [
    {
        label: 'Public',
        key: VISIBILITY_OPTIONS.PUBLIC,
        icon: <GlobalOutlined />,
    },
    {
        label: 'Friends',
        key: VISIBILITY_OPTIONS.FRIENDS,
        icon: <UserOutlined />,
    },
    {
        label: 'Private',
        key: VISIBILITY_OPTIONS.PRIVATE,
        icon: <LockOutlined />,
    },
];

export default function PostCreate({ onPost }) {
    const [values, handleChange, handleSubmit, setValues] = useForm(submitPost, { text: '', img: [], visibility: VISIBILITY_OPTIONS.FRIENDS });
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewImages, setPreviewImages] = useState([]);
    const [imageContent, setImageContent] = useState({});
    const [imageContentModalVisible, setImageContentModalVisible] = useState(false);
    const { user } = useAuth();

    const avatar = (user.avatarUrl || user.avatarUrl !== "") ? user.avatarUrl : "http://placehold.it/160x160";

    const uploadImageToFirebase = async (files) => {
        if (!files || files.length === 0) return [];

        try {
            const uploadPromises = files.map(async (file) => {
                const actualFile = file.originFileObj || file;
                const fileName = `${Date.now()}_${actualFile.name}`;

                try {
                    const storageRef = ref(storage, `posts/${fileName}-${Date.now()}-${actualFile.name}`);
                    const snapshot = await uploadBytes(storageRef, actualFile);
                    return await getDownloadURL(snapshot.ref);
                } catch (error) {
                    console.error(`Error uploading file ${fileName}:`, error);
                    throw error;
                }
            });

            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Error in uploadImageToFirebase:', error);
            throw error;
        }
    };

    const handleSubmitPost = async () => {

        setUploading(true);

        try {
            const imageUrls = await uploadImageToFirebase(values.img);

            const media = imageUrls.map((url, index) => ({
                type: 'image',
                url: url,
                thumbnailUrl: url,
                size: 0,
                content: imageContent[previewImages[index].uid] || null,
            }));

            const postData = {
                title: "Your Post Title",
                content: values.text,
                media: media,
                visibility: values.visibility,
                tags: [],
                sharedPostId: null,
            };

            const response = await api.post("/posts/", postData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.status === 201) {
                message.success('Post created successfully!');
                if (onPost) {
                    onPost(response.data);
                }
                setValues({ text: '', img: [] });
                setFileList([]);
            }
        } catch (error) {
            console.error("Error creating post:", error);
            message.error(
                error.response?.data?.message ||
                'Failed to create post. Please try again.'
            );
        } finally {
            setUploading(false);
            setIsModalOpen(false);
        }
    };

    function submitPost(event) {
        event.preventDefault();
        handleSubmitPost();
    }

    const handleImageChange = ({ fileList }) => {
        const files = fileList.map(file => file.originFileObj);
        handleChange({ name: 'img', value: files });
        setFileList(fileList);

        const previews = fileList.map(file => ({
            uid: file.uid,
            name: file.name,
            status: 'done',
            url: URL.createObjectURL(file.originFileObj),
            content: null
        }));
        setPreviewImages(previews);
        setImageContent(previews.reduce((acc, file) => ({ ...acc, [file.uid]: file.content }), {}));
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


    const handleRemove = (file) => {
        setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
        const updatedImages = values.img.filter(img => img !== file.originFileObj);
        setValues({ ...values, img: updatedImages });
    };

    const handleVisibilityChange = ({ key }) => {
        setValues(prev => ({ ...prev, visibility: key }));
    };


    const menuProps = {
        items,
        onClick: handleVisibilityChange,
    };

    const getVisibilityLabel = () => {
        const option = items.find(item => item.key === values.visibility);
        return option ? option.label : 'Friends';
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showImageContentModal = () => {
        setImageContentModalVisible(true);
    };

    const handleImageContentModalOk = () => {
        setImageContentModalVisible(false);
    };

    const handleImageContentModalCancel = () => {
        setImageContentModalVisible(false);
    };

    const handleImageContentChange = (uid, content) => {
        setImageContent((prev) => ({ ...prev, [uid]: content }));
    };


    const ImageContentModal = ({ visible, onOk, onCancel, imageContent: initialImageContent, onContentChange }) => {
        // Add local state to manage content changes
        const [localImageContent, setLocalImageContent] = useState({});

        // Initialize local content when modal opens
        useEffect(() => {
            if (visible) {
                setLocalImageContent(initialImageContent);
            }
        }, [visible, initialImageContent]);

        // Handle final save
        const handleSave = () => {
            Object.entries(localImageContent).forEach(([uid, content]) => {
                onContentChange(uid, content);
            });
            onOk();
        };

        return (
            <Modal
                title="Set Image Content"
                open={visible}
                onOk={handleSave}
                onCancel={onCancel}
                footer={[
                    <Button key="cancel" onClick={onCancel}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSave}>
                        Save
                    </Button>
                ]}
                destroyOnClose={false}
            >
                {previewImages.map((image) => (
                    <div key={image.uid} style={{ marginBottom: '16px' }}>
                        <img src={image.url} alt={image.name} style={{ maxWidth: '100%', marginBottom: '8px' }} />
                        <Input
                            placeholder="Enter image content"
                            value={localImageContent[image.uid] || ''}
                            onChange={(e) => {
                                setLocalImageContent(prev => ({
                                    ...prev,
                                    [image.uid]: e.target.value
                                }));
                            }}
                        />
                    </div>
                ))}
            </Modal>
        );
    };

    return (
        <>
            <Card className="PostCreate">
                <Space>
                    <Avatar icon={<UserOutlined />} imgId={user.avatarUrl} />
                    <Button
                        type="text"
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                        onClick={showModal}
                    >
                        What's on your mind?
                    </Button>
                </Space>
            </Card>
            <Modal 
            title="Create a new post" 
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={handleCancel} 
            footer={null}
            width={1000}
            height={800}
            >
                <form onSubmit={submitPost}>
                    <Space style={{ margin: "12px 0" }}>
                        <Avatar imgId={avatar} />
                        <Space direction="vertical">
                            <span>{user.username}</span>
                            <Dropdown menu={menuProps}>
                                <Button>
                                    <Space>
                                        {getVisibilityLabel()}
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Space>
                    </Space>
                    <Input.TextArea
                        rows={3}
                        name="text"
                        placeholder="What is on your mind?"
                        onChange={handleChange}
                        value={values.text}
                        className="PostCreate-input-text"
                        aria-label="Post content"
                        disabled={uploading}
                        variant="borderless"
                        showUploadList={false}
                    />
                    <Divider />
                    {
                        fileList.length >= 1 && (
                            <Button style={{ marginBottom: '10px' }} onClick={showImageContentModal}>
                                Edit All
                            </Button>
                        )
                    }
                    <Upload
                        name="img"
                        multiple
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handleImageChange}
                        onRemove={handleRemove}
                        listType="picture-card"
                        accept='image/*'
                        disabled={uploading}
                    >
                        {
                            fileList.length > 0 ?
                                <PlusOutlined /> :
                                (
                                    <Button disabled={uploading} size='small'>
                                        Add Image
                                    </Button>
                                )
                        }
                    </Upload>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginTop: '10px' }}
                        loading={uploading}
                        disabled={uploading}
                    >
                        {uploading ? 'Sharing...' : 'Share'}
                    </Button>
                </form>
            </Modal>
            <ImageContentModal
                visible={imageContentModalVisible}
                onOk={handleImageContentModalOk}
                onCancel={handleImageContentModalCancel}
                imageContent={imageContent}
                onContentChange={handleImageContentChange}
            />
        </>
    );
}