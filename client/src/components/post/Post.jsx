import React from 'react';
import { Card, Row, Col } from 'antd';
import Avatar from '../avatar/Avatar';
import Like from '../interact/Like';
import CommentButton from '../interact/CommentButton';
import Comments from '../interact/Comments';
import Slideshow from '../slideshow/Slideshow';

export default function Post(props) {
    const [state, setState] = React.useState({
        ...props,
        showComments: false,
        commentsLoaded: false,
        comments: [],  // Assuming no comments initially
    });

    function likePost() {
        console.log('liking', props.id);
        // Replace with mock logic or remove for now
        setState({
            ...state,
            likes_num: state.liked ? state.likes_num - 1 : state.likes_num + 1,
            liked: !state.liked
        });
    }

    function parseDateTime(time) {
        const now = Date.now();
        const createdTime = new Date(time).getTime();
        const diffInSeconds = Math.floor((now - createdTime) / 1000);

        if (diffInSeconds < 60) {
            return "Just now";
        }
        if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} minute${diffInSeconds === 60 ? '' : 's'}`;
        }
        if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} hour${diffInSeconds / 3600 === 1 ? '' : 's'}`;
        }
        if (diffInSeconds < 604800) {
            return `${Math.floor(diffInSeconds / 86400)} day${diffInSeconds / 86400 === 1 ? '' : 's'}`;
        }
        if (diffInSeconds < 2419200) {
            return `${Math.floor(diffInSeconds / 604800)} week${diffInSeconds / 604800 === 1 ? '' : 's'}`;
        }
        if (diffInSeconds < 29030400) {
            return `${Math.floor(diffInSeconds / 2419200)} month${diffInSeconds / 2419200 === 1 ? '' : 's'}`;
        }
        return `${Math.floor(diffInSeconds / 29030400)} year${diffInSeconds / 29030400 === 1 ? '' : 's'} ago`;
    }


    function toggleComments() {
        console.log('toggleComments');
        if (state.commentsLoaded) {
            setState(prevState => ({
                ...prevState,
                showComments: !prevState.showComments
            }));
        } else {
            // Replace with mock logic for testing
            setTimeout(() => {
                setState(prevState => ({
                    ...prevState,
                    comments: [{ id: 1, text: 'Mock comment 1' }, { id: 2, text: 'Mock comment 2' }],
                    commentsLoaded: true,
                    showComments: true
                }));
            }, 500);
        }
    }

    return (
        <Card className="postCard" style={{ marginBottom: '16px' }}>
            <Card.Meta
                avatar={<Avatar imgId={state.avatar} />}
                title={`${state.first_name} ${state.last_name}`}
                description={parseDateTime(state.created_at)}
            />
            <Row>
                <Col span={24}>
                    <p>{state.text}</p>
                    {state.images && <Slideshow images={state.images.split(',')} />}
                </Col>
            </Row>
            <div style={{ padding: '10px 0' }}>
                <span onClick={likePost} style={{ cursor: 'pointer' }}>
                    {state.likes_num} <Like liked={state.liked}>Like</Like>
                </span>
                <span onClick={toggleComments} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                    {state.comments_num} <CommentButton>Comment</CommentButton>
                </span>
            </div>
            {state.showComments && <Comments comments={state.comments} />}
        </Card>
    );
}
