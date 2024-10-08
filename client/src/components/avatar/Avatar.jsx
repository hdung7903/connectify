import React from 'react';
import { Avatar as AntAvatar } from 'antd'; 
import { UserOutlined } from '@ant-design/icons';
import './avatar.css';

export default function Avatar() {
    // Always display the anonymous avatar
    return (
        <div className="squareAspect">
            <AntAvatar 
                icon={<UserOutlined />}  // Use Ant Design User icon for anonymous avatar
                size="large" 
                className="img avatar" 
            />
        </div>
    );
}
