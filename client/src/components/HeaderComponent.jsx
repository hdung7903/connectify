import { Layout, Row, Col, Space, Typography } from 'antd';
import { useNavigate } from "react-router-dom"
import MyLogo from './MyLogo.jsx';
import { useEffect, useState } from 'react';
import DropdownMenu from './HeaderDropdown.jsx';
import useLoading from '../hooks/useLoading.jsx';
const { Header } = Layout;
const { Title } = Typography;


function HeaderComponent() {
    const [auth, setAuth] = useState(localStorage.getItem("auth") === "true");
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const navigate = useNavigate();
    const { handleNavigation } = useLoading();

    useEffect(() => {
        const handleStorageChange = () => {
            setAuth(localStorage.getItem("auth") === "true");
            setUsername(localStorage.getItem("username"));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth");
        localStorage.removeItem("username");
        setAuth(false);
        setUsername(null);
        navigate('/login');
    };


    return (
        <Header style={{ background: '#4169E1', padding: '0 50px' }}>
            <Row style={{ width: '100%', height: '100%' }} align="middle" justify="space-between">
                <Col>
                    <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleNavigation('/home')}>
                        <MyLogo />
                        <Title level={3} style={{ color: '#fff', margin: 0, paddingBottom: 25 }}>Connectify</Title>
                    </div>
                </Col>
                <Col>
                    {auth && username && (
                        <DropdownMenu username={username} handleLogout={handleLogout} />
                    )}
                </Col>
            </Row>
        </Header>
    )
}

export default HeaderComponent