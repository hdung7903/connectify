import React from 'react';
import { List } from 'antd';
import Comment from './Comment';

export default function Comments({ comments, postId }) {
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
                            parentCommentId={comment._id}
                            postId={postId}
                            replies={comment.replies}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}
