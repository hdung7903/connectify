import { Button, Card, List, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import React from 'react';

const { Paragraph } = Typography

function IntroCard(props) {
    const { bio, city, country } = props;
    return (
        <Card title="Intro">
            {bio ? (
                <>
                    <Paragraph>{user.bio}</Paragraph>
                    <Button block style={{ marginBottom: 16 }}>Edit Bio</Button>
                </>
            ) : (
                <Button block style={{ marginBottom: 16 }}>Add Bio</Button>
            )}
            {(city || country) && (
                <List
                    itemLayout="horizontal"
                    dataSource={[
                        { icon: <HomeOutlined />, text: `Lives in ${city || country}` },
                    ]}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={item.icon}
                                title={item.text}
                            />
                        </List.Item>
                    )}
                />
            )}

        </Card>
    )
}

export default IntroCard