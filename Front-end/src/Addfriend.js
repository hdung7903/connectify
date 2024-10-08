import React, { useState } from 'react';
import { Layout, Input, Avatar, List, Button, Card, Typography, Row, Col } from 'antd';
import axios from 'axios';
import './Addfriend.css';
import { Content } from 'antd/es/layout/layout';
import { UserOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Title } = Typography;

const AddFriend = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [message, setMessage] = useState('');

    const handleSearch = (value) => {
        setSearchTerm(value);
    };
    // Function to handle search
    const onSearch = async (value) => {
        // try {
        //     const response = await axios.get(`http://localhost:3000/users?search=${value}`);
        //     setUserResults(response.data);
        // } catch (error) {
        //     console.error('Error fetching users:', error);
        // }
    };
    const friends = [
        { name: 'Minh Hanh', mutualFriends: 16, avatar: null },
        { name: 'Trần Anh Quang', mutualFriends: 53, avatar: null },
        { name: 'Lê Huy Hoàng', mutualFriends: 16, avatar: null },
        { name: 'Hồng Hạnh', mutualFriends: 21, avatar: null },
        { name: 'Ngọc Trà Linh', mutualFriends: 2, avatar: null },
        { name: 'Thu Hương', mutualFriends: 39, avatar: null },
        { name: 'Tr Hằng', mutualFriends: 104, avatar: null },
    ];
    // Filter friends based on search input
    const filteredFriends = friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Function to add a friend
    const addFriend = async (userId) => {
        // try {
        //     const response = await axios.post('http://localhost:3000/add-friend', {
        //         userId: 1, // Replace with the logged-in user's ID
        //         friendId: userId,
        //     });
        //     setMessage(response.data.message);
        // } catch (error) {
        //     console.error('Error adding friend:', error);
        // }
    };

    return (
        <div className="add-friend-container">
            <Title level={2}>Add Friends</Title>
            <Search
                placeholder="Search for users..."
                enterButton="Search"
                size="large"
                onSearch={onSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', maxWidth: '400px' }}
            />
            <Row gutter={[16, 16]} justify="center">
                {userResults.length > 0 ? (
                    userResults.map((user) => (
                        <Col xs={24} sm={12} md={8} key={user.id}>
                            <Card bordered={false} style={{ marginBottom: '20px' }}>
                                <Title level={4}>{user.name}</Title>
                                <Button type="primary" onClick={() => addFriend(user.id)}>
                                    Add Friend
                                </Button>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </Row>
            <Row>
                <Layout style={{ backgroundColor: '#ffff', padding: '20px' }}>

                    {/* Friend Requests Section */}
                    <Content>
                        <Row gutter={[16, 16]}>
                            {filteredFriends.length ? (
                                filteredFriends.map((friend, index) => (
                                    <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                        <Card
                                            style={{ backgroundColor: '#ffff', borderRadius: '8px', textAlign: 'center' }}
                                            cover={
                                                <Avatar
                                                    size={100}
                                                    icon={<UserOutlined />}
                                                    style={{ margin: '20px auto', backgroundColor: '#b0b3b8' }}
                                                />
                                            }
                                        >
                                            <Card.Meta title={friend.name} description={`${friend.mutualFriends} bạn chung`} />
                                            <div style={{ marginTop: '15px' }}>
                                                <Button type="primary" style={{ marginBottom: '10px' }}>Confirm</Button>
                                                <br />
                                                <Button style={{ backgroundColor: '#3a3b3c', color: '#e4e6eb' }}>Erase</Button>
                                            </div>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p style={{ color: '#fff' }}>Không tìm thấy kết quả phù hợp.</p>
                            )}
                        </Row>
                    </Content>
                </Layout>
            </Row>
        </div>
    );
};
export default AddFriend;
