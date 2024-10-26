import { Input, Button, Card, Form, Checkbox, message, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import MyLogo from '../../components/MyLogo';
import { useState } from 'react';
import Spinning from '../../components/Spinning';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

function LoginPage() {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const { loginContext } = useAuth(); ;

  const onFinish = async (values) => {
    setSpinning(true);
    try {
      const result = await loginContext(values);
      if (result.success) {
        message.success("Login successful. Welcome back!");
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 100);
      } else {
        message.error(`Login failed! ${result.message}`);
      }
    } catch (error) {
      message.error(`Login failed! ${error.message}`);
    } finally {
      setSpinning(false);
    }
  };


  const onFinishFailed = () => {
    message.error('Please complete the form!');
    setSpinning(false);
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
          <Title level={2} style={{ marginBottom: 0 }}>Login</Title>
          <Text style={{ fontSize: '16px' }}>
            Welcome back! Please login to your account.
          </Text>
          <Form
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>

            <Space style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/forgot-password">Forgot password?</Link>|
              <Link to="/register">Register now!</Link>
            </Space>
          </Form>
        </Space>
      </Card>
    </>
  );
}

export default LoginPage;