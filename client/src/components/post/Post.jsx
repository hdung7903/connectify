import React from 'react';
import { Card, Row, Col } from 'antd';
import Avatar from '../avatar/Avatar';
import Reaction from '../interact/Reaction';
import CommentButton from '../interact/CommentButton';
import Comments from '../interact/Comments';
import Slideshow from '../slideshow/Slideshow';
import { ShareAltOutlined } from '@ant-design/icons';
import './post.css';

export default function Post(props) {
    const { avatar, text, images, likes_num, liked, comments_num, created_at, first_name, last_name } = props;
    const [state, setState] = React.useState({
        ...props,
        showComments: false,
        commentsLoaded: false,
        comments: [],
        selectedReaction: null,
    });

    function handleReaction(reaction) {
        const { selectedReaction, likes_num } = state;

        if (selectedReaction === reaction) {
            setState(prevState => ({
                ...prevState,
                selectedReaction: null,
                likes_num: prevState.likes_num - 1,
            }));
        } else if (selectedReaction && selectedReaction !== reaction) {
            setState(prevState => ({
                ...prevState,
                selectedReaction: reaction,
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                selectedReaction: reaction,
                likes_num: prevState.likes_num + 1,
            }));
        }
    }

    function parseDateTime(time) {
        const now = Date.now();
        const createdTime = new Date(time).getTime();
        const diffInSeconds = Math.floor((now - createdTime) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute${diffInSeconds === 60 ? '' : 's'}`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${diffInSeconds / 3600 === 1 ? '' : 's'}`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${diffInSeconds / 86400 === 1 ? '' : 's'}`;
        if (diffInSeconds < 2419200) return `${Math.floor(diffInSeconds / 604800)} week${diffInSeconds / 604800 === 1 ? '' : 's'}`;
        if (diffInSeconds < 29030400) return `${Math.floor(diffInSeconds / 2419200)} month${diffInSeconds / 2419200 === 1 ? '' : 's'}`;
        return `${Math.floor(diffInSeconds / 29030400)} year${diffInSeconds / 29030400 === 1 ? '' : 's'} ago`;
    }

    function toggleComments() {
        if (state.commentsLoaded) {
            setState(prevState => ({
                ...prevState,
                showComments: !prevState.showComments
            }));
        } else {
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
                avatar={<Avatar avatar={avatar} />}
                title={`${first_name} ${last_name}`}
                description={parseDateTime(created_at)}
            />
            <div className="post-split"></div>
            <Row>
                <Col span={24}>
                    <p>{state.text}</p>
                    {Array.isArray(state.images) && <Slideshow images={state.images} />}
                </Col>
            </Row>
            <div className="post-split"></div>
            <div className="post-stats">
                <div className="post-stats-left">{state.likes_num} reactions</div>
                <div className="post-stats-right">{state.comments_num} comments</div>
            </div>
            <div className="post-split"></div>
            <div className="post-actions">
                <Reaction onReaction={handleReaction} />
                <span onClick={toggleComments} className="comment-button">
                    <CommentButton>Comment</CommentButton>
                </span>
                <span className="share-button">
                    <ShareAltOutlined />
                    Share
                </span>
            </div>
            {state.showComments && <Comments comments={state.comments} />}
        </Card>
    );
}
