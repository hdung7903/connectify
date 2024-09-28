import { Card, Typography } from "antd";
import React from "react";

const { Title, Paragraph } = Typography;

export const FeatureCard = ({ icon, title, description }) => (
    <Card style={{ height: '100%' }}>
        {React.createElement(icon, { style: { fontSize: '2rem', color: '#1890ff' } })}
        <Title level={4}>{title}</Title>
        <Paragraph>{description}</Paragraph>
    </Card>
);