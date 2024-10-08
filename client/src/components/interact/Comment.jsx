import React from 'react';
import { Row, Col, Avatar as AntAvatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Like from './Like';

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
        <Row style={{ marginBottom: '16px' }}>
            <Col span={2}>
                <AntAvatar 
                    icon={<UserOutlined />}
                    src={state.avatar ? `/api/img/${state.avatar}` : null}
                    size="large" 
                />
            </Col>
            <Col span={22}>
                <h5>{state.first_name} {state.last_name}</h5>
                <p>{state.comment}</p>
                <Like onClick={likeComment} liked={state.liked}>{state.likes_num}</Like>
            </Col>
        </Row>
    );
}
