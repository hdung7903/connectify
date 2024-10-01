import HeaderComponent from '../../components/HeaderComponent';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import FooterComponent from '../../components/FooterComponent';
import { Helmet } from "react-helmet-async";

const { Content } = Layout;

function DefaultLayout() {
    return (
        <>
            <Helmet>
                <title>Welcome to Connectify - Connect with the World</title>
                <meta name="description" content="Join Connectify, the next-generation social network designed to bring people closer together." />
            </Helmet>

            <Layout>
                <HeaderComponent />
                <Content style={{ padding: '50px' }}>
                    <Outlet />
                </Content>
                <FooterComponent />
            </Layout>
        </>

    )
}

export default DefaultLayout