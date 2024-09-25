import { Layout, Menu, Typography } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const items = [
    {
        key: 'home',
        label: 'Home',
    },
    {
        key: 'messages',
        label: 'Messages',
    },
    {
        key: 'notifications',
        label: 'Notifications',
    },
    {
        key: 'profile',
        label: 'Profile',
    }
]

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
}

function HeaderComponent() {
    return (
        <Header style={headerStyle}>
            <Title level={2} style={{ color: 'white', textAlign:"center" }}>Connectify</Title>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={items}
                style={{ flex: 1, minWidth: 0 }}
            />
        </Header>
    )
}

export default HeaderComponent