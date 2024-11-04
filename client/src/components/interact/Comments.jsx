import React from 'react';
import { List } from 'antd';
import Comment from './Comment';

export default function Comments({ comments }) {
    return (
        <div className="comments">
            <List
                dataSource={comments}
                renderItem={comment => (
                    <List.Item key={comment._id}>
                        <Comment 
                            userId={comment.userId}
                            content={comment.content}
                            reactions={comment.reactions}
                            avatarUrl={comment.avatarUrl} 
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}
