import { Row, Col, Typography, Button, Divider, Card } from 'antd';
import { UserOutlined, GlobalOutlined, TeamOutlined, MessageOutlined, SafetyOutlined, RocketOutlined } from '@ant-design/icons';
import { FeatureCard } from '../../components/FeatureCard';
import Spinning from '../../components/Spinning';
import useLoading from '../../hooks/useLoading';

const { Title, Paragraph } = Typography;

function Home() {
    const { spinning, handleNavigation } = useLoading();

    return (
        <>
            <Spinning spinning={spinning} />
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} md={16}>
                    <Title>Welcome to Connectify</Title>
                    <Paragraph>
                        Connectify is the next-generation social network designed to bring people closer together.
                        Share your thoughts, connect with friends, and discover new communities - all in one place.
                    </Paragraph>
                    <Button type="primary" size="large" onClick={() => handleNavigation('/login')}>
                        Already has an account? Let's get started
                    </Button>
                </Col>
            </Row>

            <Divider />

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

            <Divider />

            <Row gutter={[16, 16]} style={{ marginTop: '50px' }}>
                <Col span={24}>
                    <Title level={2}>Why Choose Connectify?</Title>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Privacy First" extra={<SafetyOutlined />}>
                        <Paragraph>
                            At Connectify, we prioritize your privacy. Our advanced security measures ensure that your personal information and conversations remain confidential.
                        </Paragraph>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Innovative Features" extra={<RocketOutlined />}>
                        <Paragraph>
                            We're constantly evolving. Enjoy cutting-edge features like AI-powered content recommendations, virtual events, and seamless integrations with your favorite apps.
                        </Paragraph>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '50px' }}>
                <Col span={24}>
                    <Title level={2}>Join Millions of Happy Users</Title>
                    <Paragraph>
                        Don't just take our word for it. Here's what our users are saying:
                    </Paragraph>
                </Col>
                <Col xs={24} md={8}>
                    <Card>
                        <Paragraph>"Connectify has revolutionized the way I network professionally. It's intuitive and powerful!"</Paragraph>
                        <Paragraph><strong>- Sarah J., Marketing Professional</strong></Paragraph>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card>
                        <Paragraph>"I've made friends from all over the world. Connectify truly brings people together."</Paragraph>
                        <Paragraph><strong>- Alex M., Travel Enthusiast</strong></Paragraph>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card>
                        <Paragraph>"The communities feature is fantastic. I've found my tribe of fellow tech enthusiasts!"</Paragraph>
                        <Paragraph><strong>- Raj P., Software Developer</strong></Paragraph>
                    </Card>
                </Col>
            </Row>

            <Row justify="center" style={{ marginTop: '50px' }}>
                <Col>
                    <Button type="primary" size="large" onClick={() => handleNavigation('/register')}>
                        {/* <Link to="/register">Get Started Now</Link> */}
                        Get Started with Connectify Now
                    </Button>
                </Col>
            </Row>
        </>
    )
}

export default Home