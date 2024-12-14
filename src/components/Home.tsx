import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography, Button, Image } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            
            // Create a preview URL for the selected image
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            message.error('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:5165/api/ai/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = response.data;
            console.log(data);
            message.success('Image uploaded successfully!');
            
            // Clean up: remove the preview and cached file
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setFile(null);
        } catch (error) {
            message.error('Error uploading image');
        }
    };

    return (
        <div style={{ 
            padding: '50px',
            textAlign: 'center',
            backgroundColor: '#f0f2f5',
            minHeight: '100vh'
        }}>
            <Title level={2}>Welcome back!</Title>
            <Text>You are logged in as {username}</Text>
            <div style={{ marginTop: '20px' }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'inline-block' }}
                />
                <Button
                    type="primary"
                    onClick={handleUpload}
                    style={{ marginLeft: '10px' }}
                    disabled={!file}
                >
                    Upload Image
                </Button>
            </div>
            {previewUrl && (
                <div style={{ marginTop: '20px', maxWidth: '300px', margin: '20px auto' }}>
                    <Image
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: '100%' }}
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;
