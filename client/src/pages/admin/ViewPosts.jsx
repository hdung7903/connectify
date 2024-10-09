import React, { useState } from "react";
import { Table, Avatar, Button, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const posts = [
  {
    id: 1,
    title: "Understanding React Hooks",
    content:
      "React Hooks allow you to use state and other React features without writing a class...",
    author: "John Doe",
    date: "2023-10-01",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Getting Started with Ant Design",
    content:
      "Ant Design is a popular UI library that provides a wide range of customizable components...",
    author: "Jane Smith",
    date: "2023-10-05",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    title: "State Management with Redux",
    content:
      "Redux is a state management library often used with React to manage global state...",
    author: "Michael Brown",
    date: "2023-10-09",
    avatar: "https://via.placeholder.com/150",
  },
];

const ViewPosts = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Hàm để hiển thị modal với chi tiết bài viết
  const showModal = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  // Hàm để đóng modal
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
      title: "Image",
      dataIndex: "avatar", // Chỉnh lại dataIndex cho avatar
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
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showModal(record)}
          >
            View
          </Button>
          <Button type="default" icon={<EditOutlined />}>
            Edit
          </Button>
          <Button type="danger" icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Posts List</h2>
      <Table columns={columns} dataSource={posts} rowKey="id" />

      {/* Modal hiển thị chi tiết bài viết */}
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

export default ViewPosts;
