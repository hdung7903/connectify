import { DownOutlined, SettingOutlined, UserOutlined, MessageOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Space, Avatar, Typography } from 'antd';

const { Text } = Typography;

const DropdownMenu = ({ username, handleLogout }) => {
    const items = [
        {
            key: '1',
            label: (
                <div style={{ padding: '8px 0' }}>
                    <Text strong>{username}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>View Profile</Text>
                </div>
            ),
            icon: <Avatar size={32} src="https://xsgames.co/randomusers/avatar.php?g=male" />,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Message',
            icon: <MessageOutlined />,
        },
        {
            key: '3',
            label: 'Settings',
            icon: <SettingOutlined />,
        },
        {
            key: '4',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <Dropdown menu={{ items }}>        
            <Space align='start' style={{ color: '#fff', cursor: 'pointer', alignItems: 'start', paddingBottom: '28px' }}>
                <Avatar
                    size={40}
                    src="https://xsgames.co/randomusers/avatar.php?g=male"
                    style={{alignItems: 'start'}}
                />
            </Space>
        </Dropdown>
    );
};

export default DropdownMenu;