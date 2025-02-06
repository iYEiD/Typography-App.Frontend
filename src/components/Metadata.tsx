import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography, Button, Image, Upload, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const Metadata = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploaded, setIsUploaded] = useState<boolean>(false);
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
        setSelectedFile(file);
        setIsUploaded(false);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            message.error('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        const token = localStorage.getItem('authToken');
        if (!token) {
            message.error('No authentication token found. Please login again.');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5165/api/data/meta-data', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = response.data;
            setMetadata(data);
            setError(null);
            setIsUploaded(true);
            message.success('Image uploaded successfully!');
        } catch (error) {
            message.error('Failed to upload image.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh', 
            backgroundColor: '#f0f2f5',
            paddingTop: '30px' // Adjusted padding to raise the content
        }}>
            <div style={{ marginRight: '20px', textAlign: 'center' }}>
                <Title level={2}>Upload Image and Get Metadata</Title>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload
                        beforeUpload={(file) => {
                            handleFileChange(file);
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
                        disabled={!selectedFile || loading}
                    >
                        Upload
                    </Button>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {selectedFile && !isUploaded && (
                    <div style={{ marginTop: '20px' }}>
                        <Image src={URL.createObjectURL(selectedFile)} alt="Selected" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    </div>
                )}
                {isUploaded && selectedFile && (
                    <div style={{ marginTop: '20px' }}>
                        <Image src={URL.createObjectURL(selectedFile)} alt="Uploaded" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    </div>
                )}
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
            {isUploaded && metadata && (
                <div style={{ maxHeight: '400px', overflowY: 'auto', marginLeft: '20px' }}>
                    <ul>
                        {Object.entries(metadata).map(([key, value], index) => (
                            <li key={key} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0', padding: '5px' }}>
                                <strong>{key}:</strong> {String(value)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Metadata;
