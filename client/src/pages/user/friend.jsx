import React, { useState } from 'react';
import { Input, List, Button, Card, Typography, Row, Col } from 'antd';
import axios from 'axios';
import './Addfriend.css';

const { Search } = Input;
const { Title } = Typography;

const AddFriend = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [message, setMessage] = useState('');

    // Function to handle search
    const onSearch = async (value) => {
        try {
            const response = await axios.get(`http://localhost:3000/users?search=${value}`);
            setUserResults(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Function to add a friend
    const addFriend = async (userId) => {
        try {
            const response = await axios.post('http://localhost:3000/add-friend', {
                userId: 1, // Replace with the logged-in user's ID
                friendId: userId,
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error adding friend:', error);
        }
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
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddFriend;