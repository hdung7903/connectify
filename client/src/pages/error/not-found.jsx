import { Button, Result, Typography } from 'antd';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const { Text } = Typography

const NotFoundPage = () => (
    <>
        <Helmet>
            <title>Not Found</title>
        </Helmet>
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary">
                <Link to="/home">
                    <Text>Back Home</Text>
                </Link>
            </Button>}
        />
    </>
);

export default NotFoundPage;