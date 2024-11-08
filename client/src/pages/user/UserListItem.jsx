import React from "react";
import { Avatar, Typography } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";

const { Text } = Typography;

const UserListItem = ({ handleFunction,user }) => {

  return (
    <div
      onClick={handleFunction}
      style={{
        background: "#F5F5F5",
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        transition: "background 0.3s, box-shadow 0.3s",
        marginBottom: "8px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#38B2AC";
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#F5F5F5";
        e.currentTarget.style.color = "black";
      }}
    >
      <Avatar
        style={{ marginRight: "10px", backgroundColor: "#87d068" }}
        size="large"
        icon={
          user.avatarUrl ? (
            <img src={user.avatarUrl} alt="avatar" />
          ) : (
            <UserOutlined />
          )
        }
      />
      <div>
        <Text strong>{user.username}</Text>
        <br />
        <Text style={{ fontSize: "12px", color: "#666" }}>
          <MailOutlined style={{ marginRight: "4px" }} />
          {user.email}
        </Text>
      </div>
    </div>
  );
};

export default UserListItem;
