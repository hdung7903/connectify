import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import api from '../../services/axios';

const EditProfileModal = ({ visible, onCancel, onSuccess, initialValues }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                username: initialValues.username,
                bio: initialValues.bio,
                city: initialValues.location?.city,
                country: initialValues.location?.country,
            });
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            if (values.username === initialValues.username) {
                delete values.username;
            }

            const formattedValues = {
                ...values,
                location: {
                    city: values.city,
                    country: values.country,
                },
            };
            delete formattedValues.city;
            delete formattedValues.country;

            const response = await api.put('/users/info', formattedValues, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.status === 200) {
                message.success('Profile updated successfully');
                onSuccess(response.data.user);
                onCancel();
            }
        } catch (error) {
            if (error.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Failed to update profile');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Edit Profile"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { min: 3, message: 'Username must be at least 3 characters!' },
                        { max: 30, message: 'Username must not exceed 30 characters!' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="bio"
                    label="Bio"
                    rules={[
                        { max: 500, message: 'Bio must not exceed 500 characters!' },
                    ]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="city"
                    label="City"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="country"
                    label="Country"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditProfileModal;