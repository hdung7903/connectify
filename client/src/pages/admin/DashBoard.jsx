import React, { useState } from "react";
import {
  LaptopOutlined,
  UserOutlined,
  CommentOutlined,
  GroupOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Dropdown, Space } from "antd";
import ViewListUser from "./ViewListUser";
import AccountBaned from "./AccountBaned";
import ViewPosts from "./ViewPosts"; // Import ViewPosts
import { RxAvatar } from "react-icons/rx";
import PendingPost from "./PendingPost";
import ViewPages from "./ViewPages";
import PendingPages from "./PendingPages";
import Baned from "./Baned";

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: "userManagement",
    icon: <UserOutlined />,
    label: "Users Management",
    children: [
      { key: "listUsers", label: "View list users" },
      { key: "editUser", label: "Account has been banned" },
    ],
  },
  {
    key: "postManagement",
    icon: <LaptopOutlined />,
    label: "Posts Management",
    children: [
      { key: "viewPosts", label: "View list posts" }, // Key for ViewPosts
      { key: "approvePosts", label: "Pending post" },
    ],
  },
  {
    key: "commentManagement",
    icon: <CommentOutlined />,
    label: "Comments Management",
    children: [
      {
        key: "viewComments",
        label: "List comments",
      },
    ],
  },
  {
    key: "groupManagement",
    icon: <GroupOutlined />,
    label: "Pages Management",
    children: [
      { key: "createGroup", label: "Pending" },
      { key: "manageGroupMembers", label: "Approved" },
      { key: "approveGroupContent", label: "Banned" },
    ],
  },
  {
    key: "ReportManagements",
    icon: <GroupOutlined />,
    label: " ReportManagements",
    children: [{ key: "createGroup", label: "View list reports" }],
  },
];

const accountMenu = (
  <Menu
    items={[
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: () => {
          console.log("Logged out");
        },
      },
    ]}
  />
);

const App = () => {
  const [content, setContent] = useState(<ViewListUser />);
  const [content2, setContent2] = useState("list user");

  const handleMenuClick = (key) => {
    if (key === "listUsers") {
      setContent(<ViewListUser />);
      setContent2("list user");
    } else if (key === "editUser") {
      setContent(<AccountBaned />);
      setContent2("account baned list");
    } else if (key === "viewPosts") {
      setContent(<ViewPosts />); // Chuyển sang ViewPosts
      setContent2("view posts");
    } else if (key === "approvePosts") {
      setContent(<PendingPost />);
      setContent2("pending post");
    } else if (key === "manageGroupMembers") {
      setContent(<ViewPages />);
      setContent2("View pages");
    } else if (key === "createGroup") {
      setContent(<PendingPages />);
      setContent2("Pending page");
    } else if (key === "approveGroupContent") {
      setContent(<Baned />);
      setContent2("Baned pages");
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        className="header"
        style={{
          background: "#001F3F",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <h3 style={{ color: "#ffffff" }}>Admin Dashboard</h3>
        <Dropdown overlay={accountMenu} trigger={["click"]}>
          <Space style={{ color: "#ffffff", cursor: "pointer" }}>
            <RxAvatar style={{ fontSize: "20px", display: "flex" }} />
            Admin
          </Space>
        </Dropdown>
      </Header>
      <Layout style={{ height: "100vh" }}>
        <Sider
          width={250}
          style={{
            background: "#F4F6F9",
            borderRight: "1px solid #e8e8e8",
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["listUsers"]}
            defaultOpenKeys={["userManagement"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={items}
            onClick={({ key }) => handleMenuClick(key)} // Gọi hàm xử lý khi nhấn menu
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>{content2}</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {content}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
