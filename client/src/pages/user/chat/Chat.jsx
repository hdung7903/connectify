import React, { useState } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Collapse, Tabs } from 'antd';
import {
    SearchOutlined,
    SmileOutlined,
    SendOutlined,
    FileAddOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    VideoCameraOutlined,
    PlusOutlined,
    LockOutlined,
    UserOutlined,
    BellOutlined,
    PictureOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import './Chat.css';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const chats = [
    {
        id: 1, name: 'Vân gỗ', message: 'Xíu gửi mình luôn nhé', time: '1 phút', active: true, messages: [
            { sender: 'other', text: 'Chào bạn!', time: '10:30' },
            { sender: 'me', text: 'Chào bạn, có việc gì không?', time: '10:32' },
            { sender: 'other', text: 'Mình muốn hỏi về đơn hàng', time: '10:33' },
            { sender: 'other', text: 'Giá sản phẩm bao nhiêu bạn', time: '10:34' },
            { sender: 'me', text: 'Này mình bán 200k thôi ạ', time: '10:35' },
            { sender: 'other', text: 'oke bạn giá đó ổn', time: '10:36' },
            { sender: 'other', text: 'cho mình xem thêm ảnh nhé', time: '10:36' },
            { sender: 'me', text: 'oke bạn ơi', time: '10:38' },
            { sender: 'me', text: 'bạn đợi chút shop chụp ảnh gửi bạn nhé', time: '10:39' },
            { sender: 'me', text: 'giờ mình đang ở ngoài', time: '10:39' },
            { sender: 'other', text: 'uki bạn để mình đợi vậy', time: '10:40' },
            { sender: 'other', text: 'Xíu gửi mình luôn nhé', time: '10:42' }
        ]
    },
    {
        id: 2, name: 'Tạ Long Nhật', message: 'Bạn: Bạn là ai?', time: '1 giờ', active: true, messages: [
            { sender: 'me', text: 'Bạn là ai?', time: '10:10' },
        ]
    },
    {
        id: 3, name: 'Lâm Trần', message: 'Bạn: Để mình xem', time: '2 giờ', active: true, messages: [
            { sender: 'other', text: 'Bạn có rảnh không?', time: '09:45' },
            { sender: 'me', text: 'Để mình xem', time: '09:46' }
        ]
    },
    {
        id: 4, name: 'Tran Diệp Anh', message: 'Bạn: Tớ trêu z thui', time: '6 giờ', active: false, messages: [
            { sender: 'other', text: 'Bạn có rảnh không?', time: '09:45' },
            { sender: 'me', text: 'Để mình xem', time: '09:46' }
        ]
    },{
        id: 5, name: 'Quang Phạm', message: 'Chào cậu', time: '2 giờ', active: false, messages: [
            { sender: 'other', text: 'Bạn có rảnh không?', time: '09:45' },
            { sender: 'me', text: 'Để mình xem', time: '09:46' }
        ]
    },
    {
        id: 6, name: 'Tuấn Dương', message: 'Mình hâm mộ bạn lắm', time: '10 giờ', active: true, messages: [
            { sender: 'other', text: 'Bạn có rảnh không?', time: '09:45' },
            { sender: 'me', text: 'Để mình xem', time: '09:46' }
        ]
    },
    {
        id: 7, name: 'Hà Lan', message: 'Đẹp luôn', time: '15 phút', active: true, messages: [
            { sender: 'other', text: 'Bạn có rảnh không?', time: '09:45' },
            { sender: 'me', text: 'Để mình xem', time: '09:46' }
        ]
    },
    {
        id: 8, name: 'Nguyễn Tú Thục Anh', message: 'Bạn: Cuối tuần mình rảnh', time: '30 phút', active: false, messages: [
            { sender: 'other', text: 'Bạn có rảnh không?', time: '09:45' },
            { sender: 'me', text: 'Để mình xem', time: '09:46' }
        ]
    },
    {
        id: 9, name: 'Vũ Hải', message: 'Ok chốt', time: '15 giờ', active: false, messages: [
            { sender: 'other', text: 'Bạn có rảnh không?', time: '09:45' },
            { sender: 'me', text: 'Để mình xem', time: '09:46' }
        ]
    },
];

function Chat() {
    const [selectedChat, setSelectedChat] = useState(chats[0]);

    return (
        <Layout style={{ height: '100vh' }}>
            {/* Sidebar bên trái */}
            <Sider width="25%" theme="light" className="chat-sider">
                <div className="chat-header">
                    <Text strong>Đoạn chat</Text>
                    <Button icon={<PlusOutlined />} className="chat-add-button" />
                </div>
                <Input
                    placeholder="Tìm kiếm trên Messenger"
                    prefix={<SearchOutlined />}
                    className="chat-search"
                />
                <Tabs defaultActiveKey="1" className="chat-tabs">
                    <TabPane tab="Hộp thư" key="1">
                        <List
                            itemLayout="horizontal"
                            dataSource={chats}
                            renderItem={(item) => (
                                <List.Item
                                    className={`chat-list-item ${item.id === selectedChat.id ? 'active' : ''}`}
                                    onClick={() => setSelectedChat(item)} // Cập nhật cuộc hội thoại đang được chọn
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://via.placeholder.com/40" />}
                                        title={
                                            <div className="chat-list-title">
                                                <span>{item.name}</span>
                                                {item.active && <span className="chat-list-status-dot" />}
                                            </div>
                                        }
                                        description={`${item.message} · ${item.time}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>
                    <TabPane tab="Cộng đồng" key="2">
                        {/* Nội dung cộng đồng */}
                    </TabPane>
                </Tabs>
            </Sider>

            {/* Phần hội thoại chính */}
            <Layout style={{ width: '50%' }}>
                <Header className="chat-header-main">
                    <Avatar src="https://via.placeholder.com/40" size={40} />
                    <div className="chat-header-info">
                        <div className="chat-header-name-status">
                            <Text strong className="chat-header-name">{selectedChat.name}</Text>
                            <div className="chat-status-dot"></div>
                            <Text className="chat-status-text">Đang hoạt động</Text>
                        </div>
                    </div>
                    <div className="chat-header-actions">
                        <Button icon={<PhoneOutlined />} className="chat-header-button" />
                        <Button icon={<VideoCameraOutlined />} className="chat-header-button" />
                        <Button icon={<InfoCircleOutlined />} className="chat-header-button" />
                    </div>
                </Header>


                <Content className="chat-content">
                    {/* Nội dung phần hội thoại */}
                    <div className="chat-messages">
                        {selectedChat.messages.map((message, index) => (
                            <div key={index} className={`chat-message ${message.sender === 'me' ? 'right' : 'left'}`}>
                                {message.sender !== 'me' && <Avatar src="https://via.placeholder.com/40" />}
                                <div className={`chat-bubble ${message.sender === 'me' ? 'chat-bubble-right' : ''}`}>
                                    {message.text}
                                </div>
                                <span className={`chat-time ${message.sender === 'me' ? 'chat-time-right' : ''}`}>
                                    {message.time}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Thanh nhập tin nhắn */}
                    <div className="chat-input-container">
                        <Button icon={<PlusOutlined />} className="chat-input-button" />
                        <Input className="chat-input" placeholder="Aa" />
                        <Button icon={<SmileOutlined />} className="chat-input-button" />
                        <Button icon={<SendOutlined />} className="chat-input-send" />
                    </div>
                </Content>
            </Layout>

            {/* Sidebar bên phải */}
            <Sider width="25%" theme="light" className="chat-sider-right">
                <div className="chat-sider-content">
                    <Avatar src="https://via.placeholder.com/80" size={80} className="chat-avatar" />
                    <div className="chat-user-info">
                        <Text strong className="chat-user-name">{selectedChat.name}</Text>
                        <div className="chat-status">
                            <span className="chat-status-dot"></span>
                            <Text className="chat-status-text">Đang hoạt động</Text>
                        </div>
                    </div>
                    <div className="chat-encryption-status">
                        <Button icon={<LockOutlined />} type="text" className="chat-encryption-button">
                            Được mã hóa đầu cuối
                        </Button>
                    </div>
                    <div className="chat-actions">
                        <div className="chat-action-item">
                            <UserOutlined />
                          
                        </div>
                        <div className="chat-action-item">
                            <BellOutlined />
                          
                        </div>
                        <div className="chat-action-item">
                            <SearchOutlined />
                       
                        </div>
                    </div>

                    <Collapse defaultActiveKey={['1']} className="chat-collapse">
                        <Panel header="Thông tin về đoạn chat" key="1">
                            {/* Nội dung thông tin thêm */}
                        </Panel>
                        <Panel header="Tùy chỉnh đoạn chat" key="2">
                            {/* Tùy chọn đoạn chat */}
                        </Panel>
                        <Panel header="File phương tiện & file" key="3">
                            <div>
                                <div className="file-item"><PictureOutlined /> File phương tiện</div>
                                <div className="file-item"><FileTextOutlined /> File</div>
                            </div>
                        </Panel>
                        <Panel header="Quyền riêng tư & hỗ trợ" key="4">
                            {/* Quyền riêng tư */}
                        </Panel>
                    </Collapse>
                </div>
            </Sider>


        </Layout>
    );
}

export default Chat;
