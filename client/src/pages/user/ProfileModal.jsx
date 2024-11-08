import React from "react";
import { Modal, Button, Typography, Avatar } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ProfileModal = ({ user, children }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {children ? (
        <span onClick={showModal}>{children}</span>
      ) : (
        <Button
          icon={<EyeOutlined />}
          onClick={showModal}
          type="text"
          style={{ display: "flex" }}
        />
      )}
      <Modal
        title={user.name}
        visible={isVisible}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
        centered
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar size={150} src={user.pic} alt={user.name} />
          <Text style={{ fontSize: "20px", marginTop: "16px" }}>
            Email: {user.email}
          </Text>
        </div>
      </Modal>
    </>
  );
};

export default ProfileModal;
