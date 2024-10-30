import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

const { Content } = Layout;

function DefaultLayout() {
    return (
        <>
            <Helmet>
                <title>Connectify</title>
                <meta name="description" content="Join Connectify, the next-generation social network designed to bring people closer together." />
            </Helmet>

            <Layout style={{ display: 'flex'}}>
                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </>

    )
}

export default DefaultLayout