import React, { useState } from 'react';
import { login } from '../services/authService';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Card, 
  message, 
  Divider,
  Checkbox
} from 'antd';
import { 
  LockOutlined, 
  MailOutlined, 
  GoogleOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      const response = await login(values.email, values.password);

      // Store the token in localStorage
      localStorage.setItem('authToken', response.token);

      message.success('Login successful!');
      
      // Redirect to home page
      window.location.href = '/home';
    } catch (error) {
      message.error('Incorrect email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5165/api/auth/signin-google';
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#f0f2f5' 
      }}
    >
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Welcome Back</Title>
          <Text type="secondary">Log in to your account</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ rememberMe: false }}
        >
          {/* Email Field */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
            />
          </Form.Item>

          {/* Remember Me and Forgot Password */}
          <Form.Item>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: '#1890ff' }}>
                Forgot password?
              </Link>
            </div>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={isLoading}
            >
              Log In
            </Button>
          </Form.Item>

          <Divider>or</Divider>

          {/* Google Login Button */}
          <Button 
            icon={<GoogleOutlined />}
            block
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Log in with Google
          </Button>

          {/* Signup Link */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: 16 
          }}>
            <Text>Don't have an account? </Text>
            <Link to="/signup" style={{ color: '#1890ff' }}>
              Sign up
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;