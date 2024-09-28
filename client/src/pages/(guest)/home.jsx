import { Row, Col, Typography } from 'antd';
import { UserOutlined, GlobalOutlined, TeamOutlined, MessageOutlined } from '@ant-design/icons';
import { FeatureCard } from '../../components/FeatureCard';
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

function Home() {
    return (
        <>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} md={16}>
                    <Title>Welcome to Connectify</Title>
                    <Paragraph>
                        Connectify is the next-generation social network designed to bring people closer together.
                        Share your thoughts, connect with friends, and discover new communities - all in one place.
                    </Paragraph>
                    <Link to="/register">
                        Join Connectify Today
                    </Link>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '50px' }}>
                <Col xs={24} sm={12} md={6}>
                    <FeatureCard
                        icon={UserOutlined}
                        title="Personal Profiles"
                        description="Create your unique profile and showcase your personality to the world."
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <FeatureCard
                        icon={GlobalOutlined}
                        title="Global Connections"
                        description="Connect with people from around the globe and expand your horizons."
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <FeatureCard
                        icon={TeamOutlined}
                        title="Communities"
                        description="Join or create communities based on your interests and passions."
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <FeatureCard
                        icon={MessageOutlined}
                        title="Real-time Messaging"
                        description="Stay in touch with your connections through our instant messaging feature."
                    />
                </Col>
            </Row>
        </>
    )
}

export default Home