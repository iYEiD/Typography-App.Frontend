import React, { useState, useEffect } from 'react';
import { Input, Button, message, List, Modal } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
    imageName: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const Search: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedImage, setSelectedImage] = useState<SearchResult | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

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

    const handleSearch = async () => {
        if (!searchQuery) {
            message.error('Please enter a search query.');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            message.error('No authentication token found. Please login again.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5165/api/image/search', {
                params: { query: searchQuery },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            setSearchResults(response.data);
            message.success('Search completed successfully!');
        } catch (error) {
            message.error('Error performing search');
        }
    };

    const handleImageClick = (item: SearchResult) => {
        setSelectedImage(item);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedImage(null);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: searchResults.length ? 'flex-start' : 'center', minHeight: '100vh' }}>
            {!searchResults.length && (
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>SnapSearch</h1> // Adjusted marginBottom to raise the title
            )}
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}> 
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter search query"
                    style={{ width: '400px', height: '40px', fontSize: '16px', marginRight: '10px' }}
                />
                <Button type="primary" onClick={handleSearch} style={{ height: '40px', fontSize: '16px' }}>
                    Search
                </Button>
            </div>
            {searchResults.length > 0 && (
                <div style={{ marginTop: '20px', width: '100%' }}>
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={searchResults}
                        renderItem={item => (
                            <List.Item key={item.imageName}>
                                <div style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
                                    <img
                                        alt="Search Result"
                                        src={`http://127.0.0.1:9000/images/${item.imageName}`}
                                        onClick={() => handleImageClick(item)}
                                        style={{ cursor: 'pointer', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            )}
            {selectedImage && (
                <Modal
                    title="Image Details"
                    visible={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                    width={800} // Increased the width of the modal
                >
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            width="50%" // Reduced the width of the image
                            alt="Selected"
                            src={`http://127.0.0.1:9000/images/${selectedImage.imageName}`}
                        />
                    </div>
                    <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                        <p><strong>Description:</strong> {selectedImage.description}</p>
                    </div>
                    <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                        <p><strong>Created At:</strong> {formatDate(selectedImage.createdAt)}</p>
                        <p><strong>Updated At:</strong> {formatDate(selectedImage.updatedAt)}</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Search;
