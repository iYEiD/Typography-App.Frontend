import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography, Button, Upload, Spin, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const ContextFinder: React.FC = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleFileChange = (file: File) => {
        setSelectedFile(file);
        setImageUrl(URL.createObjectURL(file));
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
            const response = await axios.post('http://localhost:5165/api/data/analyze-image', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = response.data;
            setAnalysisResult(JSON.stringify(data, null, 2)); // Convert object to string
            message.success('Image analyzed successfully!');
        } catch (error) {
            message.error('Failed to analyze image.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh', 
            backgroundColor: '#f0f2f5',
            paddingTop: '30px'
        }}>
            <Title level={2}>Upload Image for Analysis</Title>
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
            {imageUrl && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Image
                        width={200}
                        src={imageUrl}
                        alt="Selected Image"
                    />
                </div>
            )}
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
            {analysisResult && (
                <div style={{ 
                    marginTop: '20px', 
                    textAlign: 'center', 
                    border: '1px solid #d9d9d9', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    backgroundColor: '#fff',
                    width: '80%',
                    maxWidth: '600px'
                }}>
                    <Title level={4}>Analysis Result</Title>
                    <Paragraph style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                        {analysisResult}
                    </Paragraph>
                </div>
            )}
        </div>
    );
};

export default ContextFinder;
