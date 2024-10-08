import { Layout } from 'antd';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

function layout() {
    return (
        <>
            <Helmet>
                <title>Connectify Authentication</title>
                <meta name="description" content="Join Connectify, the next-generation social network designed to bring people closer together." />
            </Helmet>
            <Layout style={{
                minHeight: '100vh',
                background: "#4169E1",
                display: 'flex',
                alignItems: 'center'

            }}>
                <Content style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </>
    )
}

export default layout