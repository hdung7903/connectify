import React from 'react';
import { Row, Col, Avatar as AntAvatar, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Reaction from './Reaction';
import Avatar from '../avatar/Avatar';
import { Link } from 'react-router-dom';

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
                <Col flex="auto" style={{ marginLeft: '8px' }}>
                    <Card style={{ marginBottom: '8px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                        <Card.Meta
                            title={
                                <Link to={`/profile/1`} className="profile-link" style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                    {`${state.first_name} ${state.last_name}`}
                                </Link>
                            }
                        />
                        <p style={{ margin: '4px 0 8px 0' }}>{state.comment}</p>
                        <Reaction onClick={likeComment} liked={state.liked}>
                            {state.likes_num}
                        </Reaction>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
