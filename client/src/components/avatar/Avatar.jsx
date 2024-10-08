// Avatar.jsx
import React from 'react';
import { Avatar as AntAvatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './avatar.css';

export default function Avatar({ imgId }) {
    return (
        <div className="squareAspect">
            <AntAvatar 
                src={imgId} // Use the provided imgId for the avatar
                icon={<UserOutlined />} // Fallback icon if imgId is not valid
                size="large"
                className="img avatar"
            />
        </div>
    );
}
