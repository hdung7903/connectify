import { Input, Button, Card, Form, Checkbox, message, Typography, Space, Select, DatePicker } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import MyLogo from '../../components/MyLogo';
import Spinning from '../../components/Spinning';
import { useState } from 'react';
import { registerService } from '../../services/auth.service';

const { Title, Text } = Typography;
const { Option } = Select;

function RegisterPage() {
    const [spinning, setSpinning] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setSpinning(true);
        const { success, message: resultMessage } = await registerService(values);
        setSpinning(false);

        if (success) {
            message.success(resultMessage);
            navigate('/login');
        } else {
            message.error(resultMessage);
        }
    };


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Please complete the form correctly!');
    };

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
                    <Title level={2} style={{ marginBottom: 0 }}>Register</Title>
                    <Text style={{ fontSize: '16px' }}>
                        Create your account to get started
                    </Text>
                    <Form
                        name="registerForm"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                { min: 6, message: 'Password must be at least 6 characters long!' }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
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
                            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            rules={[{ required: true, message: 'Please select your gender!' }]}
                        >
                            <Select placeholder="Select your gender">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="dob"
                            rules={[{ required: true, message: 'Please input your date of birth!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Date of Birth" />
                        </Form.Item>

                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                                { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must accept the agreement')) },
                            ]}
                        >
                            <Checkbox>I agree to the terms and conditions</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large">
                                Register
                            </Button>
                        </Form.Item>

                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>Already have an account?</Text>
                            <Link to="/login">Login here</Link>
                        </Space>
                    </Form>
                </Space>
            </Card>
        </>
    );
}

export default RegisterPage;