import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Card, Form, message, Typography, Space } from 'antd';
import { LockOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import MyLogo from '../../components/MyLogo';
import Spinning from '../../components/Spinning';

const { Title, Text } = Typography;

function ResetPasswordPage() {
    const { token, email } = useParams();
    const navigate = useNavigate();
    const [isValidToken, setIsValidToken] = useState(false);
    const [spinning, setSpinning] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password/${token}/${email}`);
                if (response.status === 200) {
                    setIsValidToken(true);
                }
            } catch (error) {
                message.error(error.response?.data?.message || 'Invalid or expired token. Please try again.');
            } finally {
                setSpinning(false);
            }
        };
        verifyToken();
    }, [token, email]);

    const onFinish = async (values) => {
        setSpinning(true);
        try {
            const { password } = values;
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, {
                token,
                email,
                password
            });
            if (response.status === 200) {
                message.success('Password reset successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                message.error(response.data.message || 'Failed to reset password');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setSpinning(false);
        }
    };

    const resendResetPasswordForm = async () => {
        setSpinning(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/resend-reset-password`, { email });
            if (response.status === 200) {
                message.success('Reset password link sent to your email!');
            } else {
                message.error(response.data.message || 'Failed to resend reset password');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to resend reset password. Please try again.');
        } finally {
            setSpinning(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Failed to reset password. Please try again.');
    };

    return (
        <>
            <Spinning spinning={spinning} />
            {isValidToken ? (
            <Card style={{
                width: '100%',
                maxWidth: '500px',
                padding: '40px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.8)'
            }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Space>
                        <MyLogo />
                        <Title level={2} style={{ color: '#4169E1', margin: 0 }}>Connectify</Title>
                    </Space>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Reset Password</Title>
                    <Text style={{ fontSize: '16px' }}>
                        Enter your new password and confirm it.
                    </Text>
                    <Form
                        name="resetPasswordForm"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your new password!' },
                                { min: 6, message: 'Password must be at least 6 characters long!' }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your new password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Reset Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Card>
            ):(
                <Card
                title="Verification Failed"
                style={{ textAlign: 'center' }}
            >
                <CloseCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
                <p>Your token or email is invalid. You can resend the verification email and try again.</p>
                <Button type="primary" onClick={resendResetPasswordForm}>
                    Resend Reset Password Form
                </Button>
            </Card>
            )}
        </>
    );
}

export default ResetPasswordPage;
