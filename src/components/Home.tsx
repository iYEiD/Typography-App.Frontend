import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography } from 'antd';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const validateToken = () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                localStorage.removeItem('authToken');
                message.error('Invalid token, please login again');
                navigate('/login');
                return;
            }

            try {
                // Decode JWT payload
                const payload = JSON.parse(atob(token.split('.')[1]));

                // Check if token has expired
                const isTokenExpired = payload.exp * 1000 < Date.now();
                if (isTokenExpired) {
                    throw new Error('Token expired');
                }

                // Set username from token payload
                setUsername(payload.email || 'User');
            } catch (error) {
                // If token is invalid or expired, remove it and redirect
                localStorage.removeItem('authToken');
                message.error('Invalid token, please login again');
                navigate('/login');
            }
        };

        validateToken();
    }, [navigate]);

    return (
        <div style={{ 
            padding: '50px',
            textAlign: 'center',
            backgroundColor: '#f0f2f5',
            minHeight: '100vh'
        }}>
            <Title level={2}>Welcome back!</Title>
            <Text>You are logged in as {username}</Text>
        </div>
    );
};

export default HomePage;
