import React, { useState } from 'react';
import { Card, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './postCreate.css';
import useForm from '../hooks/useForm';

export default function PostCreate(props) {
    const [values, handleChange, handleSubmit, setValues] = useForm(submitPost, { text: '', img: [] });
    const [fileList, setFileList] = useState([]);

    function submitPost() {
        console.log(values);
        let body = JSON.stringify(values);
        let headers = {
            'Content-Type': 'application/json'
        };
        if (values.img.length > 0) {
            body = new FormData();
            body.append('text', values.text);
            for (let i = 0; i < values.img.length; i++) {
                body.append('file' + i, values.img[i]);
            }
            headers = {};
        }

        fetch('/api/post', {
            method: 'POST',
            body: body,
            headers: headers,
        })
            .then(response => {
                console.log(response);
                if (props.onPost) {
                    props.onPost();
                }
                setValues({ text: '', img: [] });
                setFileList([]);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const handleImageChange = ({ fileList }) => {
        setFileList(fileList);
        const files = fileList.map(file => file.originFileObj);
        handleChange({ target: { name: 'img', value: files } });
    };

    return (
        <Card className="PostCreate" title="Write a new post">
            <form onSubmit={handleSubmit}>
                <Input.TextArea
                    rows={3}
                    name="text"
                    placeholder="What is on your mind?"
                    onChange={handleChange}
                    value={values.text}
                    className="PostCreate-input-text"
                />
                <Upload
                    name="img"
                    multiple
                    fileList={fileList}
                    beforeUpload={(file) => {
                        setFileList([...fileList, { uid: file.uid, name: file.name, status: 'done', originFileObj: file }]);
                        return false;
                    }}
                    onChange={handleImageChange}
                    listType="picture"
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
