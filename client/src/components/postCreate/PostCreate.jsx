import React, { useState } from 'react';
import { Card, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Avatar from '../avatar/Avatar';
import './postCreate.css';
import useForm from '../../hooks/useForm';

export default function PostCreate({ onPost }) {
    const [values, handleChange, handleSubmit, setValues] = useForm(submitPost, { text: '', img: [] });
    const [fileList, setFileList] = useState([]);

    function submitPost() {
        const newPost = {
            id: Date.now(),
            userId: 1,
            text: values.text,
            images: values.img.map(img => URL.createObjectURL(img)),
            likes_num: 0,
            liked: false,
            comments_num: 0,
            created_at: new Date().toISOString()
        };

        let existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
        existingPosts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(existingPosts));

        if (onPost) {
            onPost(newPost);
        }

        setValues({ text: '', img: [] });
        setFileList([]);
    }

    const handleImageChange = ({ fileList }) => {
        const files = fileList.map(file => file.originFileObj);
        handleChange({ name: 'img', value: files });
        setFileList(fileList);
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error(`${file.name} is not an image file.`);
            return Upload.LIST_IGNORE;
        }

        const newFile = {
            uid: file.uid,
            name: file.name,
            status: 'done',
            url: URL.createObjectURL(file),
            originFileObj: file
        };

        setFileList(prevList => [...prevList, newFile]);

        return false;
    };

    const handleRemove = (file) => {
        setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
        const updatedImages = values.img.filter(img => img !== file.originFileObj);
        setValues({ ...values, img: updatedImages });
    };

    return (
        <Card className="PostCreate" title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar imgId="https://xsgames.co/randomusers/avatar.php?g=male" />
                <span style={{ marginLeft: '10px' }}>Write a new post</span>
            </div>
        }>
            <div className="post-split"></div>
            <form onSubmit={handleSubmit}>
                <Input.TextArea
                    rows={3}
                    name="text"
                    placeholder="What is on your mind?"
                    onChange={handleChange}
                    value={values.text}
                    className="PostCreate-input-text"
                    aria-label="Post content"
                />
                <Upload
                    name="img"
                    multiple
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onChange={handleImageChange}
                    onRemove={handleRemove}
                    listType="picture"
                    accept='image/*'
                >
                    <Button icon={<UploadOutlined />}>Upload Images</Button>
                </Upload>
                <Button type="primary" htmlType="submit" style={{ marginTop: '10px' }}>
                    Share
                </Button>
            </form>
        </Card>
    );
}
