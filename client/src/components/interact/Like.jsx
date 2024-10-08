import React from 'react';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';

export default function Like(props) {
    return (
        <span onClick={props.onClick} style={{ cursor: 'pointer' }}>
            {props.liked ? <LikeFilled /> : <LikeOutlined />}
            {props.children}
        </span>
    );
}
