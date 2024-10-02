import React, { useState } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Collapse, Tabs } from 'antd';
import {
    SearchOutlined,
    SmileOutlined,
    SendOutlined,
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
import '../../style/chat.css';

const { Sider, Content } = Layout;
const { Text } = Typography;

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
    }, {
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
    const [isSiderRightVisible, setIsSiderRightVisible] = useState(false);

    const tabItems = [
        {
            key: '1',
            label: 'Inbox',
            children: (
                <List
                    style={{overflowY: 'auto', height: '100%'}}
                    itemLayout="horizontal"
                    dataSource={chats}
                    renderItem={(item) => (
                        <List.Item
                            className={`chat-list-item ${item.id === selectedChat.id ? 'active' : ''}`}
                            onClick={() => setSelectedChat(item)}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src="https://via.placeholder.com/40" />}
                                title={
                                    <div className="chat-list-title">
                                        <span>{item.name}</span>
                                        {item.active && <span className="chat-status-dot" />}
                                    </div>
                                }
                                description={`${item.message} · ${item.time}`}
                            />
                        </List.Item>
                    )}
                />
            ),
        },
        {
            key: '2',
            label: 'Communities',
            children: <div>Communities Chat</div>,
        },
    ];

    const collapseItems = [
        {
            key: '1',
            label: 'Chat Info',
            children: <div>Chat Details Information</div>,
        },
        {
            key: '2',
            label: 'Customize Chat',
            children: <div>Tùy chọn đoạn chat</div>,
        },
        {
            key: '3',
            label: 'Media & Files',
            children: (
                <div>
                    <div className="file-item"><PictureOutlined /> File phương tiện</div>
                    <div className="file-item"><FileTextOutlined /> File</div>
                </div>
            ),
        },
        {
            key: '4',
            label: 'Privacy & support',
            children: <div>Quyền riêng tư</div>,
        },
    ];

    const toggleSiderRight = () => {
        setIsSiderRightVisible(!isSiderRightVisible);
    };

    return (
        <Layout className="chat-layout">
            <Sider width={300} theme="light" className="chat-sider">
                <div className="chat-header">
                    <Text strong>Chats</Text>
                    <Button icon={<PlusOutlined />} type="primary" shape="circle" />
                </div>
                <Input
                    placeholder="Tìm kiếm trên Messenger"
                    prefix={<SearchOutlined />}
                    className="chat-search"
                />
                <Tabs items={tabItems} className="chat-tabs" />
            </Sider>

            <Layout>
                <Layout.Header className="chat-header-main">
                    <Avatar src={`https://i.pravatar.cc/150?u=${selectedChat.id}`} size={40} />
                    <div className="chat-header-info">
                        <Text strong className="chat-header-name">{selectedChat.name}</Text>
                        <div className="chat-status">
                            <span className="chat-status-dot"></span>
                            <Text type="secondary">Active Now</Text>
                        </div>
                    </div>
                    <div className="chat-header-actions">
                        <Button icon={<PhoneOutlined />} shape="circle" />
                        <Button icon={<VideoCameraOutlined />} shape="circle" />
                        <Button icon={<InfoCircleOutlined />} shape="circle" onClick={toggleSiderRight} />
                    </div>
                </Layout.Header>
                <Content className="chat-content" style={{ overflowY: "auto" }}>
                    <div className="chat-messages">
                        {selectedChat.messages.map((message, index) => (
                            <div key={index} className={`chat-message ${message.sender === 'me' ? 'right' : 'left'}`}>
                                {message.sender !== 'me' && <Avatar src={`https://i.pravatar.cc/150?u=${selectedChat.id}`} />}
                                <div className={`chat-bubble ${message.sender === 'me' ? 'chat-bubble-right' : ''}`}>
                                    {message.text}                                   
                                </div>
                                <span className="chat-time">{message.time}</span>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input-container">
                        <Button icon={<PlusOutlined />} shape="circle" />
                        <Input
                            className="chat-input"
                            placeholder="Aa"
                            suffix={<SmileOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                        />
                        <Button icon={<SendOutlined />} type="primary" shape="circle" />
                    </div>
                </Content>
            </Layout>

            {isSiderRightVisible && (
                <Sider width={300} theme="light" className="chat-sider-right">
                    <div className="chat-sider-content">
                        <Avatar src={`https://i.pravatar.cc/150?u=${selectedChat.id}`} size={80} className="chat-avatar" />
                        <div className="chat-user-info">
                            <Text strong className="chat-user-name">{selectedChat.name}</Text>
                            <div className="chat-status">
                                <span className="chat-status-dot"></span>
                                <Text type="secondary">Đang hoạt động</Text>
                            </div>
                        </div>
                        <div className="chat-encryption-status">
                            <Button icon={<LockOutlined />} type="text">
                                Được mã hóa đầu cuối
                            </Button>
                        </div>
                        <div className="chat-actions">
                            <Button icon={<UserOutlined />} shape="circle" />
                            <Button icon={<BellOutlined />} shape="circle" />
                            <Button icon={<SearchOutlined />} shape="circle" />
                        </div>

                        <Collapse ghost items={collapseItems} defaultActiveKey={['1']} className="chat-collapse" />
                    </div>
                </Sider>
            )}
        </Layout>
    );
}

export default Chat;