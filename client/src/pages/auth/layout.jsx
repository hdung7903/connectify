import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

function layout() {
    return (
        <Layout>
            <Content><Outlet /></Content>
        </Layout>
    )
}

export default layout