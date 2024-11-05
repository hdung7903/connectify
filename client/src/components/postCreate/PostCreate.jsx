import React, { useState } from 'react';
import { Card, Input, Upload, Button, message, Dropdown, Space } from 'antd';
import { DownOutlined, GlobalOutlined, LockOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import Avatar from '../avatar/Avatar';
import './postCreate.css';
import useForm from '../../hooks/useForm';
import api from '../../services/axios';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

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

            const media = imageUrls.map((url) => ({
                type: 'image',
                url: url,
                thumbnailUrl: url,
                size: 0,
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

        // Check if the file is already in the fileList
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

    return (
        <Card className="PostCreate" title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={<img src={avatar} alt='avatar' />} />
                <span style={{ marginLeft: '10px' }}>Write a new post</span>
            </div>
        }>
            <div className="post-split"></div>
            <form onSubmit={submitPost}>
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
                />
                <Dropdown menu={menuProps}>
                    <Button>
                        <Space>
                            {getVisibilityLabel()}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
                <Upload
                    name="img"
                    multiple
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onChange={handleImageChange}
                    onRemove={handleRemove}
                    listType="picture"
                    accept='image/*'
                    disabled={uploading}
                >
                    <Button icon={<UploadOutlined />} disabled={uploading}>
                        Upload Images
                    </Button>
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
        </Card>
    );
}