import { Card, Col, Row, Space, Typography, Button, Modal, List, Avatar as AntAvatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import Avatar from '../avatar/Avatar'

const { Text } = Typography

function FriendList(props) {
    const { friends, onClick } = props
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAllFriendsModalOpen, setIsAllFriendsModalOpen] = useState(false);

    const handleAvatarClick = (friend) => {
        setSelectedFriend(friend);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedFriend(null);
    };

    const handleAllFriendsModalClose = () => {
        setIsAllFriendsModalOpen(false);
    };

    const showAllFriendsModal = () => {
        setIsAllFriendsModalOpen(true);
    };

    return (
        <>
            <Card 
                title={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Text strong>Friends</Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {friends?.length || 0} Friends
                        </Text>
                    </div>
                } 
                style={{ marginTop: 16 }}
            >
                <Row gutter={[16, 16]}>
                    {friends?.slice(0, 9).map((friend, index) => (
                        <Col span={8} key={index}>
                            <Space direction="vertical" align="center" style={{ width: '100%' }}>
                                <Avatar 
                                    shape="square" 
                                    size={80} 
                                    imgId={friend?.avatar} 
                                    icon={<UserOutlined />} 
                                    onClick={() => handleAvatarClick(friend)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <Text 
                                    style={{ 
                                        display: 'block', 
                                        textAlign: 'center',
                                        width: '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {friend?.username}
                                </Text>
                            </Space>
                        </Col>
                    ))}
                </Row>
                <Button 
                    block 
                    style={{ marginTop: 16 }} 
                    onClick={showAllFriendsModal}
                >
                    See All Friends
                </Button>
            </Card>

            {/* Individual Friend Modal */}
            <Modal
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width={400}
                centered
            >
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    padding: '20px 0'
                }}>
                    <Avatar 
                        size={200} 
                        src={selectedFriend?.avatarUrl || "http://placehold.co/160x160"} 
                        icon={<UserOutlined />}
                    />
                    <Text 
                        strong 
                        style={{ 
                            fontSize: '1.5em', 
                            marginTop: 16 
                        }}
                    >
                        {selectedFriend?.username}
                    </Text>
                    {selectedFriend?.bio && (
                        <Text 
                            style={{ 
                                marginTop: 8,
                                textAlign: 'center' 
                            }}
                        >
                            {selectedFriend.bio}
                        </Text>
                    )}
                    <Space style={{ marginTop: 16 }}>
                        <Button type="primary" onClick={() => window.location.href = `/profile/${selectedFriend?._id}`}>
                            View Profile
                        </Button>
                        <Button onClick={handleModalClose}>
                            Close
                        </Button>
                    </Space>
                </div>
            </Modal>

            {/* All Friends Modal */}
            <Modal
                title={`All Friends (${friends?.length || 0})`}
                open={isAllFriendsModalOpen}
                onCancel={handleAllFriendsModalClose}
                footer={null}
                width={600}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={friends || []}
                    renderItem={friend => (
                        <List.Item
                            actions={[
                                <Button 
                                    type="link" 
                                    onClick={() => window.location.href = `/profile/${friend?._id}`}
                                >
                                    View Profile
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <AntAvatar 
                                        size={64} 
                                        src={friend?.avatarUrl || "http://placehold.co/160x160"}
                                        icon={<UserOutlined />}
                                    />
                                }
                                title={friend?.username}
                                description={friend?.bio}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    )
}

export default FriendList