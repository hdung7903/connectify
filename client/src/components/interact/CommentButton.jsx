import React from 'react';
import { CommentOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export default function CommentButton(props) {
    return (
        <Button type="text">
            <CommentOutlined style={{ marginRight: 4 }} />
            {props.children}
        </Button>
    );
}
