import { Input, Button, Card, Form, message, Typography, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
const { Title, Text } = Typography;

function ForgotPasswordPage() {
    const onFinish = (values) => {
        console.log('Success:', values);
        message.success('Password reset link sent to your email!');
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Please enter a valid email address!');
    };

    return (
        <Card style={{ maxWidth: 400, margin: '50px auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Forgot Password</Title>
            <Text style={{ display: 'block', marginBottom: 24, textAlign: 'center' }}>
                Enter your email address and we'll send you a link to reset your password.
            </Text>
            <Form
                name="forgotPasswordForm"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
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
                    <Button type="primary" htmlType="submit" block>
                        Send Reset Link
                    </Button>
                </Form.Item>

                <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                    <Link href="/login">Remember your password? Login</Link>
                    <Link href="/register">Don't have an account? Register</Link>
                </Space>
            </Form>
        </Card>
    );
}

export default ForgotPasswordPage;