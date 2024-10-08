import React from 'react';
import { Row, Col, Avatar as AntAvatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Reaction from './Reaction';

export default function Comment(props) {
    const [state, setState] = React.useState({
        ...props,
        liked: false,
        likes_num: props.likes_num || 0,
    });

    function likeComment() {
        setState({
            ...state,
            likes_num: state.liked ? state.likes_num - 1 : state.likes_num + 1,
            liked: !state.liked
        });
    }

    return (
        <div>
            <Row align="middle" style={{ marginBottom: '16px' }}>
                <Col>
                    <AntAvatar 
                        icon={<UserOutlined />} 
                        src={state.avatar ? `/api/img/${state.avatar}` : null}
                        size="large" 
                    />
                </Col>
                <Col className="comment" flex="auto" style={{ marginLeft: '8px' }}>
                    <h5 style={{ margin: 0 }}>{state.first_name} {state.last_name}</h5>
                    <p style={{ margin: 0 }}>{state.comment}</p>
                    <Reaction onClick={likeComment} liked={state.liked}>{state.likes_num}</Reaction>
                </Col>
            </Row>
        </div>
    );
}
