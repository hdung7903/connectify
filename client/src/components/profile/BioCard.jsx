import { Button, Card, List, Typography, Modal, Form, Input, Space } from 'antd';
import { HomeOutlined, EnvironmentOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

function IntroCard(props) {
    const { bio, city, country, onUpdate } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleModalOpen = () => {
        form.setFieldsValue({
            bio: bio || '',
            city: city || '',
            country: country || ''
        });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const handleSubmit = async (values) => {
        try {
            if (onUpdate) {
                await onUpdate(values);
            }
            handleModalClose();
        } catch (error) {
            console.error('Error updating intro:', error);
        }
    };

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
            <Card 
                title="Intro"
            >
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
                            onClick={handleModalOpen}
                        >
                            Edit Bio
                        </Button>
                    </>
                ) : (
                    <Button 
                        block 
                        style={{ marginBottom: 16 }}
                        onClick={handleModalOpen}
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

            <Modal
                title="Edit Profile Info"
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        bio: bio || '',
                        city: city || '',
                        country: country || ''
                    }}
                >
                    <Form.Item
                        name="bio"
                        label="Bio"
                        rules={[
                            {
                                max: 500,
                                message: 'Bio cannot be longer than 500 characters'
                            }
                        ]}
                    >
                        <TextArea
                            placeholder="Write something about yourself..."
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item
                        name="city"
                        label="City"
                        rules={[
                            {
                                max: 100,
                                message: 'City name is too long'
                            }
                        ]}
                    >
                        <Input 
                            placeholder="Enter your city"
                            prefix={<EnvironmentOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        name="country"
                        label="Country"
                        rules={[
                            {
                                max: 100,
                                message: 'Country name is too long'
                            }
                        ]}
                    >
                        <Input 
                            placeholder="Enter your country"
                            prefix={<HomeOutlined />}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={handleModalClose}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Save Changes
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default IntroCard;