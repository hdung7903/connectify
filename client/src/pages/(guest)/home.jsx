import { Layout, Button, Input, Card, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function Home() {
    return (
        <Content className="p-8">
            <div className="max-w-3xl mx-auto">
                <Card className="mb-8">
                    <Input.TextArea
                        rows={4}
                        placeholder="What's on your mind?"
                        className="mb-4"
                    />
                    <Button type="primary">Post</Button>
                </Card>

                <Card className="mb-8">
                    <div className="flex items-start mb-4">
                        <Avatar size="large" icon={<UserOutlined />} className="mr-4" />
                        <div>
                            <Title level={5} className="m-0">John Doe</Title>
                            <Paragraph className="text-gray-500">2 hours ago</Paragraph>
                        </div>
                    </div>
                    <Paragraph>
                        Just had an amazing day at the beach! The sunset was breathtaking. 🌅
                    </Paragraph>
                    <div className="flex justify-between mt-4">
                        <Button type="text">Like</Button>
                        <Button type="text">Comment</Button>
                        <Button type="text">Share</Button>
                    </div>
                </Card>

            </div>
        </Content>
    )
}

export default Home