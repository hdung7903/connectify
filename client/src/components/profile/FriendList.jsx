import { Card, Col, Row, Space, Typography, Button } from 'antd'
import {UserOutlined} from '@ant-design/icons'
import React from 'react'
import Avatar from '../avatar/Avatar'

const { Text } = Typography

function FriendList(props) {
    const { friends} = props
    return (
        <Card title={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text strong>Friends</Text>
                <Text type="secondary" fontSize="10px">{friends.length} Friends</Text>
            </div>
        } style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
                {friends.map((friend, index) => (
                    <Col span={8} key={index}>
                        <Space direction="vertical">
                            <Avatar shape="square" size={80} src={(friend.avatarUrl || friend.avatarUrl !== "") ? friend.avatarUrl : "http://placehold.co/160x160"} icon={<UserOutlined />} onClick={() => setIsModalOpen(true)} />
                            <Text style={{ display: 'block', textAlign: 'center' }}>{friend.username}</Text>
                        </Space>
                    </Col>
                ))}
            </Row>
            <Button block style={{ marginTop: 16 }}>See All Friends</Button>
        </Card>
    )
}

export default FriendList