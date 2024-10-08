import { Layout } from 'antd';

const { Footer } = Layout;

function FooterComponent() {
    return (
        <Footer style={{
            textAlign: 'center',
        }}>
            Connectify ©{new Date().getFullYear()} Created with Ant Design
        </Footer>
    )
}

export default FooterComponent