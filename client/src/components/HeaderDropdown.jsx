import { SettingOutlined, MessageOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Space, Avatar, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import useLoading from '../hooks/useLoading';
import Spinning from './Spinning';

const { Text } = Typography;

const DropdownMenu = ({ username, avatar, handleLogout }) => {

    const { spinning, handleNavigation } = useLoading();

    const items = [
        {
            key: '1',
            label: (
                <div style={{ padding: '8px 0' }} onClick={() => handleNavigation("/profile", 500)}>
                    <Text strong>{username}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>View Profile</Text>
                </div>
            ),
            icon: <Avatar size={32} src={avatar ?? "https://xsgames.co/randomusers/avatar.php?g=male"} />,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Settings',
            icon: <SettingOutlined />,
        },
        {
            key: '3',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <>
            <Spinning spinning={spinning} />

            <Dropdown menu={{ items }}>
                <Space align='start' style={{ color: '#fff', cursor: 'pointer', alignItems: 'start', paddingBottom: '28px' }}>
                    <Avatar
                        size={40}
                        src={avatar ?? "https://xsgames.co/randomusers/avatar.php?g=male"}
                        style={{ alignItems: 'start' }}
                    />
                </Space>
            </Dropdown>
        </>
    );
};

export default DropdownMenu;