import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const { Header, Footer, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const getSelectedKey = () => {
        switch (location.pathname) {
            case '/search':
                return '1';
            case '/upload':
                return '2';
            default:
                return '1';
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header>
                <div className="logo" style={{ float: 'left', color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '20px' }}>
                    SnapSearch 
                </div>
                <Menu theme="dark" mode="horizontal" selectedKeys={[getSelectedKey()]} style={{ flex: 1 }}>
                    <Menu.Item key="1">
                        <Link to="/search">Search</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/upload">Upload</Link>
                    </Menu.Item>
                    <Menu.Item key="3" style={{ marginLeft: 'auto' }}>
                        <Button type="primary" danger onClick={handleLogout}>
                            Logout
                        </Button>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px', flex: '1 0 auto' }}>
                <div className="site-layout-content" style={{ height: '100%' }}>
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center', flexShrink: '0' }}>
                SnapSearch ©2024 Created by Youssef Eid
            </Footer>
        </Layout>
    );
};

export default AppLayout;
