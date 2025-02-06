import React, { useState } from 'react';
import { signup } from '../services/authService';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Card, 
  message, 
  Divider 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  GoogleOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Title, Text } = Typography;

// Validation rules
const signupRules = {
  username: [
    { required: true, message: 'Please input your username!' },
    { min: 6, message: 'Username must be at least 6 characters' }
  ],
  password: [
    { required: true, message: 'Please input your password!' },
    { min: 8, message: 'Password must be at least 8 characters' },
    {
      validator: async (_:any, value:any) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (value && !passwordRegex.test(value)) {
          throw new Error('Password must include uppercase, lowercase, number, and special character');
        }
      }
    }
  ]
};

const SignupPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      await signup(values.username, values.email, values.password);

      message.success('Signup successful!');
      window.location.href = '/login';
    } catch (error) {
      message.error('Email already exists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
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
          <Title level={3}>Create Your Account</Title>
          <Text type="secondary">Sign up to get started</Text>
        </div>

        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          layout="vertical"
        >
          {/* Username Field */}
          <Form.Item
            name="username"
            rules={signupRules.username}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
            />
          </Form.Item>

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
            rules={signupRules.password}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={isLoading}
            >
              Create Account
            </Button>
          </Form.Item>

          <Divider>or</Divider>

          {/* Google Signup Button */}
          <Button 
            icon={<GoogleOutlined />}
            block
            onClick={handleGoogleSignup}
            disabled={isLoading}
          >
            Sign up with Google
          </Button>
          <div style={{ 
            textAlign: 'center', 
            marginTop: 16 
          }}>
            <Text>Already have an account? </Text>
            <Link to="/login" style={{ color: '#1890ff' }}>
              Log in
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignupPage; 