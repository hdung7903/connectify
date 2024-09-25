import HeaderComponent from '../../components/HeaderComponent';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import FooterComponent from '../../components/FooterComponent';

const { Content } = Layout;

function DefaultLayout() {
    return (
        <Layout>
            <HeaderComponent />
            <Content><Outlet /></Content>
            <FooterComponent />
        </Layout>
    )
}

export default DefaultLayout