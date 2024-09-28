import { Input, Button, Card, Form, Checkbox, message, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const { Title } = Typography;

function LoginPage() {
  const onFinish = (values) => {
    console.log('Success:', values);
    if (values.username === 'admin' && values.password === 'admin') {
      message.success('Logged in successfully');
    } else {
      message.error('Invalid username or password');
    }
  };

  const onFinishFailed = () => {
    message.error('Please complete the form!');
  };

  return (
    <Card style={{ maxWidth: 400, margin: '50px auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Login</Title>
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
    </Card>
  );
}

export default LoginPage;