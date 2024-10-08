import { Input, Button, Card, Form, message, Typography, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import MyLogo from '../../components/MyLogo';
import { useState } from 'react';
import Spinning from '../../components/Spinning';
const { Title, Text } = Typography;

function ForgotPasswordPage() {

    const navigate = useNavigate();
    const [spinning, setSpinning] = useState(false);

    const onFinish = (values) => {
        setSpinning(true);
        console.log('Success:', values);
        message.success('Password reset link sent to your email!');
        setTimeout(() => {
            navigate('/login');
            setSpinning(false);
        }, 1000);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Please enter a valid email address!');
    };

    return (
        <>
            <Spinning spinning={spinning} />
            <Card style={{
                width: '100%',
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
                    <Text style={{ fontSize: '16px' }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </Text>
                    <Form
                        name="forgotPasswordForm"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large">
                                Send Reset Link
                            </Button>
                        </Form.Item>

                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Link to="/login">Remember your password? Login</Link>
                            <Link to="/register">Don't have an account? Register</Link>
                        </Space>
                    </Form>
                </Space>
            </Card>
        </>
    );
}

export default ForgotPasswordPage;