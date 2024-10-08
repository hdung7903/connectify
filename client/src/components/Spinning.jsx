import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
function Spinning({ spinning }) {
    return (
        <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined spin />} size="large" />
    );
};

export default Spinning