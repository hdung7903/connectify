import React, { useState } from "react";
import { Table, Avatar, Button, Space, Tag, Modal } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const posts = [
  {
    id: 1,
    title: "Understanding React Hooks",
    content:
      "React Hooks allow you to use state and other React features without writing a class...",
    author: "John Doe",
    date: "2023-10-01",
    avatar: "https://via.placeholder.com/150",
    status: "pending",
  },
  {
    id: 2,
    title: "Getting Started with Ant Design",
    content:
      "Ant Design is a popular UI library that provides a wide range of customizable components...",
    author: "Jane Smith",
    date: "2023-10-05",
    avatar: "https://via.placeholder.com/150",
    status: "pending",
  },
  {
    id: 3,
    title: "State Management with Redux",
    content:
      "Redux is a state management library often used with React to manage global state...",
    author: "Michael Brown",
    date: "2023-10-09",
    avatar: "https://via.placeholder.com/150",
    status: "approved",
  },
];

const PendingPost = () => {
  // Trạng thái modal và bài viết được chọn
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Lọc các bài viết có trạng thái "pending"
  const pendingPosts = posts.filter((post) => post.status === "pending");

  // Hiển thị modal với thông tin bài viết được chọn
  const showModal = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => <Avatar src={avatar} />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="orange">Pending</Tag>, // Trạng thái luôn là pending
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showModal(record)}>
            View Details
          </Button>
          <Button type="primary" icon={<CheckOutlined />}>
            Approve
          </Button>
          <Button type="danger" icon={<CloseOutlined />}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Pending Posts List</h2>
      <Table columns={columns} dataSource={pendingPosts} rowKey="id" />

      {/* Modal hiển thị nội dung chi tiết của bài viết */}
      <Modal
        title={selectedPost ? selectedPost.title : "Post Details"}
        visible={isModalVisible}
        onCancel={handleClose}
        footer={null}
      >
        {selectedPost && (
          <div>
            <p>
              <strong>Author:</strong> {selectedPost.author}
            </p>
            <p>
              <strong>Date:</strong> {selectedPost.date}
            </p>
            <p>
              <strong>Content:</strong> {selectedPost.content}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingPost;
