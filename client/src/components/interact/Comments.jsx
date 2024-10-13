    import React from 'react';
    import { List } from 'antd';
    import Comment from './Comment';

    export default function Comments(props) {
        return (
            <div className="comments">
                <List
                    dataSource={props.comments}
                    renderItem={comment => (
                        <List.Item key={comment.id}>
                            <Comment {...comment} />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
