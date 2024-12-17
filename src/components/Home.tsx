import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography, Button, Image, Upload, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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
                const payload = JSON.parse(atob(token.split('.')[1]));
                const isTokenExpired = payload.exp * 1000 < Date.now();
                if (isTokenExpired) {
                    throw new Error('Token expired');
                }
            } catch (error) {
                localStorage.removeItem('authToken');
                message.error('Invalid token, please login again');
                navigate('/login');
            }
        };

        validateToken();
    }, [navigate]);

    const handleFileChange = (file: File) => {
        setFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleUpload = async () => {
        if (!file) {
            message.error('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('authToken');
        if (!token) {
            message.error('No authentication token found. Please login again.');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5165/api/image/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = response.data;
            console.log(data);
            message.success('Image uploaded successfully!');
            
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setFile(null);
        } catch (error) {
            message.error('Error uploading image');
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        }
        return isImage;
    };

    return (
        <div style={{ 
            position: 'relative',
            padding: '50px',
            textAlign: 'center',
            backgroundColor: '#f0f2f5',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ marginBottom: '20px', zIndex: 1 }}>
                <Title level={2}>Upload Your Images!</Title>
                <div style={{ marginTop: '20px' }}>
                    <Upload
                        beforeUpload={(file) => {
                            if (beforeUpload(file)) {
                                handleFileChange(file);
                            }
                            return false;
                        }}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} style={{ marginRight: '10px' }} disabled={loading}>
                            Select Image
                        </Button>
                    </Upload>
                    <Button
                        type="primary"
                        onClick={handleUpload}
                        disabled={!file || loading}
                    >
                        Upload Image
                    </Button>
                </div>
            </div>
            {loading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2
                }}>
                    <Spin size="large" />
                </div>
            )}
            {previewUrl && (
                <div style={{ marginTop: '20px', maxWidth: '600px', margin: '20px auto', zIndex: 1 }}>
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
