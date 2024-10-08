import React, { useState } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Collapse, Tabs, Modal, Form, Checkbox } from 'antd';
import {
    SearchOutlined,
    SmileOutlined,
    SendOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    VideoCameraOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import '../../style/chat.css';

const { Sider, Content } = Layout;
const { Text } = Typography;
const { Panel } = Collapse;

const users = [
    { id: 1, name: 'Kiên', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Trang', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Bon', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'Luyện Minh', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, name: 'Tuấn Dương', avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: 6, name: 'Hà Lan', avatar: 'https://i.pravatar.cc/150?u=6' },
    { id: 7, name: 'Nguyễn Tú Thục Anh', avatar: 'https://i.pravatar.cc/150?u=7' },
    { id: 8, name: 'Vũ Hải', avatar: 'https://i.pravatar.cc/150?u=8' },
];

let chats = [
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
            { sender: 'other', text: 'Xíu gửi mình luôn nhé', time: '10:42' },
            { sender: 'other', text: 'Xíu gửi mình luôn nhé', time: '10:42' }
        ]
    },
    {
        id: 2, name: 'EXE101', message: 'Từ 10h đến 12h', time: '5 giờ', active: true, type: 'group', members: [
            { id: 1, name: 'Kiên', avatar: 'https://i.pravatar.cc/150?u=1' },
            { id: 2, name: 'Trang', avatar: 'https://i.pravatar.cc/150?u=2' },
            { id: 3, name: 'Bon', avatar: 'https://i.pravatar.cc/150?u=3' },
            { id: 4, name: 'Luyện Minh', avatar: 'https://i.pravatar.cc/150?u=4' },
        ], messages: [
            { sender: 'Kiên', text: 't tưởng học on như bình thường', time: '10:00', avatar: 'https://i.pravatar.cc/150?u=1' },
            { sender: 'Trang', text: 'Hnnhu ko học gì í', time: '10:05', avatar: 'https://i.pravatar.cc/150?u=2' },
            { sender: 'me', text: 'ảo hay sao ấy', time: '10:10' },
            { sender: 'Luyện Minh', text: 'Chắc xếp lịch nhầm đấy', time: '10:11', avatar: 'https://i.pravatar.cc/150?u=4' },
            { sender: 'Bon', text: 'Hình như bị lỗi toàn bộ hệ thống rồi chứ làm gì có gì', time: '10:13', avatar: 'https://i.pravatar.cc/150?u=3' },
            { sender: 'Luyện Minh', text: 'Để t liên lạc với trường coi sao', time: '10:19', avatar: 'https://i.pravatar.cc/150?u=4' },
            { sender: 'me', text: 'hoang manggg', time: '10:20' },
            { sender: 'Bon', text: 'Thôi kệ đi anh khum sao đâu', time: '10:21', avatar: 'https://i.pravatar.cc/150?u=3' },
            { sender: 'Trang', text: 'E cũng nghĩ vậy', time: '10:23', avatar: 'https://i.pravatar.cc/150?u=2' },
            { sender: 'Trang', text: 'Trường làm ăn vớ vẩn ghê', time: '10:23', avatar: 'https://i.pravatar.cc/150?u=2' },
            { sender: 'Trang', text: 'Haizz', time: '10:24', avatar: 'https://i.pravatar.cc/150?u=2' },
            { sender: 'me', text: 'Tối 10h họp nhé anh em', time: '10:25' },
            { sender: 'Bon', text: 'oke sếp', time: '10:27', avatar: 'https://i.pravatar.cc/150?u=3' },
            { sender: 'Luyện Minh', text: 'Vâng anh', time: '10:29', avatar: 'https://i.pravatar.cc/150?u=4' },
            { sender: 'Kiên', text: 'okeee', time: '10:30', avatar: 'https://i.pravatar.cc/150?u=1' },
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
    },
    {
        id: 5, name: 'Nhóm học tập', message: 'Từ 10h đến 12h', time: '5 giờ', active: true, type: 'group', members: [
            { id: 1, name: 'Kiên', avatar: 'https://i.pravatar.cc/150?u=1' },
            { id: 2, name: 'Trang', avatar: 'https://i.pravatar.cc/150?u=2' },
            { id: 3, name: 'Bon', avatar: 'https://i.pravatar.cc/150?u=3' },
            { id: 4, name: 'Luyện Minh', avatar: 'https://i.pravatar.cc/150?u=4' },

        ], messages: [
            { sender: 'Kiên', text: 't tưởng học on như bình thường', time: '10:00', avatar: 'https://i.pravatar.cc/150?u=1' },
            { sender: 'Trang', text: 'Hnnhu ko học gì í', time: '10:05', avatar: 'https://i.pravatar.cc/150?u=2' },
            { sender: 'me', text: 'ảo hay sao ấy', time: '10:10' },
            { sender: 'Luyện Minh', text: 'Chắc xếp lịch nhầm đấy', time: '10:11', avatar: 'https://i.pravatar.cc/150?u=4' },
            { sender: 'Bon', text: 'Hình như bị lỗi toàn bộ hệ thống rồi chứ làm gì có gì', time: '10:13', avatar: 'https://i.pravatar.cc/150?u=3' },
            { sender: 'Luyện Minh', text: 'Để t liên lạc với trường coi sao', time: '10:19', avatar: 'https://i.pravatar.cc/150?u=4' },
            { sender: 'me', text: 'hoang manggg', time: '10:20' },
            { sender: 'Bon', text: 'Thôi kệ đi anh khum sao đâu', time: '10:21', avatar: 'https://i.pravatar.cc/150?u=3' },
            { sender: 'Trang', text: 'E cũng nghĩ vậy', time: '10:23', avatar: 'https://i.pravatar.cc/150?u=2' },
            { sender: 'Trang', text: 'Trường làm ăn vớ vẩn ghê', time: '10:23', avatar: 'https://i.pravatar.cc/150?u=2' },
            { sender: 'Trang', text: 'Haizz', time: '10:24', avatar: 'https://i.pravatar.cc/150?u=2' },
            { sender: 'me', text: 'Tối 10h họp nhé anh em', time: '10:25' },
            { sender: 'Bon', text: 'oke sếp', time: '10:27', avatar: 'https://i.pravatar.cc/150?u=3' },
            { sender: 'Luyện Minh', text: 'Vâng anh', time: '10:29', avatar: 'https://i.pravatar.cc/150?u=4' },
            { sender: 'Kiên', text: 'okeee', time: '10:30', avatar: 'https://i.pravatar.cc/150?u=1' },
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
    const [isSiderRightVisible, setIsSiderRightVisible] = useState(true); // Sider right visibility always true initially
    const [newMessage, setNewMessage] = useState(''); // State for new message input
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
    const [groupName, setGroupName] = useState(''); // State for new group name
    const [groupMembers, setGroupMembers] = useState([]); // State for new group members

    const toggleSiderRight = () => {
        setIsSiderRightVisible(!isSiderRightVisible);
    };

    // Hàm lấy tin nhắn cuối cùng từ danh sách tin nhắn
    const getLastMessage = (chat) => {
        if (chat.messages && chat.messages.length > 0) {
            const lastMessage = chat.messages[chat.messages.length - 1];
            if (chat.type === 'group' && lastMessage.sender !== 'me') {
                return `${lastMessage.sender}: ${lastMessage.text}`;
            } else {
                return lastMessage.text;
            }
        }
        return '';
    };

    // Hàm xử lý gửi tin nhắn mới
    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const updatedChat = {
            ...selectedChat,
            messages: [
                ...selectedChat.messages,
                { sender: 'me', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ]
        };

        // Cập nhật danh sách chat với tin nhắn mới
        setSelectedChat(updatedChat);
        setNewMessage('');

        // Cập nhật chats để thay đổi phản ánh trong danh sách chat bên trái
        const chatIndex = chats.findIndex(chat => chat.id === selectedChat.id);
        chats[chatIndex] = updatedChat;
    };

    // Hàm xử lý khi nhấn phím Enter trong input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Hàm hiển thị modal tạo group chat
    const showCreateGroupModal = () => {
        setIsModalVisible(true);
    };

    // Hàm xử lý tạo group chat mới
    const handleCreateGroup = () => {
        if (groupName.trim() === '') return;

        const newGroupChat = {
            id: chats.length + 1,
            name: groupName,
            message: 'New group created',
            time: 'Just now',
            active: true,
            type: 'group',
            members: groupMembers,
            messages: [
                { sender: 'system', text: 'New group chat has been created', time: 'Just now' }, // Thông báo hệ thống

            ],
        };

        // Đưa nhóm vừa tạo vào đầu danh sách chats
        chats = [newGroupChat, ...chats];
        setSelectedChat(newGroupChat);
        setIsModalVisible(false);
        setGroupName('');
        setGroupMembers([]);
    };

    // Hàm xử lý chọn thành viên
    const handleSelectMember = (user, checked) => {
        if (checked) {
            setGroupMembers((prev) => [...prev, user]);
        } else {
            setGroupMembers((prev) => prev.filter((member) => member.id !== user.id));
        }
    };

    // Hàm để đặt `selectedChat` và đảm bảo `Sider` bên phải luôn hiển thị
    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        setIsSiderRightVisible(true); // Đảm bảo Sider bên phải luôn hiển thị khi chọn một chat mới
    };

    return (
        <Layout className="chat-layout">
            <Sider width={300} theme="light" className="chat-sider">
                <div className="chat-header">
                    <Text strong>Chats</Text>
                    <Button icon={<PlusOutlined />} type="primary" shape="circle" onClick={showCreateGroupModal} />
                </div>
                <Input
                    placeholder="Tìm kiếm trên Messenger"
                    prefix={<SearchOutlined />}
                    className="chat-search"
                />
                <Tabs
                    items={[
                        {
                            key: '1',
                            label: 'Inbox',
                            children: (
                                <List
                                    style={{ overflowY: 'auto', height: '100%' }}
                                    itemLayout="horizontal"
                                    dataSource={chats}
                                    renderItem={(item) => (
                                        <List.Item
                                            className={`chat-list-item ${item.id === selectedChat.id ? 'active' : ''}`}
                                            onClick={() => handleSelectChat(item)}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar src="https://via.placeholder.com/40" />}
                                                title={
                                                    <div className="chat-list-title">
                                                        <span>{item.name}</span>
                                                        {item.active && <span className="chat-status-dot" />}
                                                    </div>
                                                }
                                                description={`${getLastMessage(item)} · ${item.time}`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            ),
                        },
                    ]}
                    className="chat-tabs"
                />
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
                        {selectedChat.messages.map((message, index, messages) => {
                            if (message.sender === 'system') {
                                return (
                                    <div key={index} className="chat-message system-message">
                                        <div className="chat-bubble system-bubble">
                                            {message.text}
                                        </div>
                                        <span className="chat-time">{message.time}</span>
                                    </div>
                                );
                            }

                            const shouldShowSenderName = selectedChat.type === 'group' &&
                                (index === 0 || messages[index - 1].sender !== message.sender);

                            return (
                                <div key={index} className={`chat-message ${message.sender === 'me' ? 'right' : 'left'}`}>
                                    {shouldShowSenderName && message.sender !== 'me' && (
                                        <div className="chat-message-header">
                                            <Avatar src={message.avatar} />
                                            <Text className="chat-sender-name">{message.sender}</Text>
                                        </div>
                                    )}
                                    <div className={`chat-bubble ${message.sender === 'me' ? 'chat-bubble-right' : ''}`}>
                                        {message.text}
                                    </div>
                                    <span className="chat-time">{message.time}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="chat-input-container">
                        <Button icon={<PlusOutlined />} shape="circle" />
                        <Input
                            className="chat-input"
                            placeholder="Aa"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            suffix={<SmileOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
                        />
                        <Button icon={<SendOutlined />} type="primary" shape="circle" onClick={handleSendMessage} />
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
                        {selectedChat.type === 'group' && (
                            <Collapse ghost defaultActiveKey={['4']} className="chat-collapse">
                                <Panel header="Thành viên trong đoạn chat" key="4">
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={selectedChat.members}
                                        renderItem={(member) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar src={member.avatar} />}
                                                    title={<span>{member.name}</span>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Panel>
                            </Collapse>
                        )}
                        <Collapse ghost defaultActiveKey={['1']} className="chat-collapse">
                            <Panel header="Chat Info" key="1">
                                <div>Chat Details Information</div>
                            </Panel>
                            <Panel header="Customize Chat" key="2">
                                <div>Tùy chọn đoạn chat</div>
                            </Panel>
                            <Panel header="Media & Files" key="3">
                                <div>
                                    <div className="file-item"><SmileOutlined /> File phương tiện</div>
                                    <div className="file-item"><SmileOutlined /> File</div>
                                </div>
                            </Panel>
                            <Panel header="Privacy & support" key="4">
                                <div>Quyền riêng tư</div>
                            </Panel>
                        </Collapse>
                    </div>
                </Sider>
            )}

            {/* Modal tạo group chat */}
            <Modal
                title="Tạo Group Chat Mới"
                visible={isModalVisible}
                onOk={handleCreateGroup}
                onCancel={() => setIsModalVisible(false)}
                okText="Tạo"
                cancelText="Hủy"
            >
                <Form layout="vertical">
                    <Form.Item label="Tên nhóm">
                        <Input
                            placeholder="Nhập tên nhóm"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Chọn thành viên">
                        <List
                            dataSource={users}
                            renderItem={(user) => (
                                <List.Item>
                                    <Checkbox
                                        onChange={(e) => handleSelectMember(user, e.target.checked)}
                                    >
                                        <Avatar src={user.avatar} /> {user.name}
                                    </Checkbox>
                                </List.Item>
                            )}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}

export default Chat;
