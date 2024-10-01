import React from 'react';
import { CommentOutlined } from '@ant-design/icons';

export default function CommentButton(props) {
    return (
        <span>
            <CommentOutlined style={{ marginRight: 4 }} />
            {props.children}
        </span>
    );
}
