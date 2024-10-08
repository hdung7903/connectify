import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Card, Form, message, Typography, Space } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import MyLogo from '../../components/MyLogo';
import Spinning from '../../components/Spinning';

const { Title, Text } = Typography;

function ResetPasswordPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isValidId, setIsValidId] = useState(false);
    const [spinning, setSpinning] = useState(true);

    useEffect(() => {
        const validateResetToken = async () => {

            const isValid = id && id.length > 0;
            setIsValidId(isValid);
            if (!isValid) {
                message.error('Invalid or expired reset token');
                navigate('/404');
            }
            setSpinning(false);
        };

        validateResetToken();
    }, [id, navigate]);

    const onFinish = (values) => {
        setSpinning(true);
        console.log('Success:', values);
        setTimeout(() => {
            message.success('Password reset successfully!');
            navigate('/login');
            setSpinning(false);
        }, 1000);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Failed to reset password. Please try again.');
    };

    if (!isValidId) {
        return null;
    }

    return (
        <>
            <Spinning spinning={spinning} />
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
        </>
    );
}

export default ResetPasswordPage;