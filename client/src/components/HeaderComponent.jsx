import { Layout, Row, Col, Space, Typography } from 'antd';
import { Link } from "react-router-dom"

const { Header } = Layout;
const { Title } = Typography;


function HeaderComponent() {
    return (
        <Header style={{ background: '#fff', padding: '0 50px' }}>
            <Row justify="space-between" align="middle" style={{ height: '100%' }}>
                <Col>
                    <Title level={3} style={{ margin: 0 }}>Connectify</Title>
                </Col>
                <Col>
                    <Space>
                        <Link to="/register">
                            Sign Up
                        </Link>
                        <Link to="/login">
                            Log In
                        </Link>
                    </Space>
                </Col>
            </Row>
        </Header>
    )
}

export default HeaderComponent