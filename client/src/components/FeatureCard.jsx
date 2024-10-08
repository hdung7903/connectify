import { Card, Typography } from "antd";
import React from "react";
import PropTypes from 'prop-types';

const { Title, Paragraph } = Typography;

export const FeatureCard = ({ icon, title, description }) => (
    <Card style={{ height: '100%' }}>
        {React.createElement(icon, { style: { fontSize: '2rem', color: '#1890ff' } })}
        <Title level={4}>{title}</Title>
        <Paragraph>{description}</Paragraph>
    </Card>
);

FeatureCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};