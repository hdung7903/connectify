import React from 'react';
import { Avatar as AntAvatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './avatar.css';

export default function Avatar({ imgId }) {
    return (
        <AntAvatar 
            src={imgId}
            icon={<UserOutlined />}
            size="large"
            className="img avatar"
        />
    );
}
