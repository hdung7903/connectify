import { Button, Card, List, Typography, Modal, Form, Input, Space, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import EditProfileModal from '../modal/EditProfileModel';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

function IntroCard(props) {
    const { bio, city, country, onUpdateSuccess, user } = props;

    const [isModalVisible, setIsModalVisible] = useState(false);


    const renderLocation = () => {
        if (!city && !country) return null;

        let locationText = '';
        if (city && country) {
            locationText = `Lives in ${city}, ${country}`;
        } else {
            locationText = `Lives in ${city || country}`;
        }

        return locationText;
    };

    return (
        <>
            <Card title="Intro">
                {bio ? (
                    <>
                        <Paragraph
                            ellipsis={{
                                rows: 3,
                                expandable: true,
                                symbol: 'more'
                            }}
                        >
                            {bio}
                        </Paragraph>
                        <Button
                            block
                            style={{ marginBottom: 16 }}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Edit Bio
                        </Button>
                    </>
                ) : (
                    <Button
                        block
                        style={{ marginBottom: 16 }}
                        onClick={() => setIsModalVisible(true)}
                    >
                        Add Bio
                    </Button>
                )}

                {(city || country) && (
                    <List
                        itemLayout="horizontal"
                        dataSource={[
                            {
                                icon: <HomeOutlined />,
                                text: renderLocation()
                            }
                        ]}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={item.icon}
                                    title={item.text}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Card>

            <EditProfileModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSuccess={onUpdateSuccess}
                initialValues={{
                    username: user?.username,
                    bio,
                    location: { city, country }
                }}
            />
        </>
    );
}

export default IntroCard;