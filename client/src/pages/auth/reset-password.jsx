import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Card, Form, message, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

function ResetPasswordPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isValidId, setIsValidId] = useState(false);

    useEffect(() => {
        // Simulating an API call to validate the reset token (id)
        const validateResetToken = async () => {
            // Replace this with actual API call
            const isValid = id && id.length > 0;
            setIsValidId(isValid);
            if (!isValid) {
                message.error('Invalid or expired reset token');
                navigate('/404');
            }
        };

        validateResetToken();
    }, [id, navigate]);

    const onFinish = (values) => {
        console.log('Success:', values);
        // Here you would typically make an API call to reset the password
        message.success('Password reset successfully!');
        navigate('/login');
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Failed to reset password. Please try again.');
    };

    if (!isValidId) {
        return null; // Return null while validating or redirecting
    }

    return (
        <Card style={{ maxWidth: 400, margin: '50px auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Reset Password</Title>
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
        </Card>
    );
}

export default ResetPasswordPage;