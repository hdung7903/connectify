import React, { useState } from "react";
import { Table, Button, Space, Modal, Form, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const initialBannedData = [
  {
    id: 1,
    title: "Banned Post 1",
    content: "Content for banned post 1...",
    author: "Banned Author 1",
    date: "2023-10-01",
  },
  {
    id: 2,
    title: "Banned Post 2",
    content: "Content for banned post 2...",
    author: "Banned Author 2",
    date: "2023-10-05",
  },
];

const Banned = () => {
  const [bannedPosts, setBannedPosts] = useState(initialBannedData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [form] = Form.useForm();

  // Hàm mở modal để chỉnh sửa bài viết
  const showModal = (post) => {
    setSelectedPost(post);
    form.setFieldsValue(post);
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
    form.resetFields();
  };

  // Hàm xử lý lưu bài viết (chỉnh sửa)
  const handleFinish = (values) => {
    setBannedPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === selectedPost.id ? { ...post, ...values } : post
      )
    );
    handleClose();
  };

  // Hàm xóa bài viết
  const handleDelete = (id) => {
    setBannedPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
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
            type="default"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Banned Posts List</h2>
      <Table columns={columns} dataSource={bannedPosts} rowKey="id" />

      {/* Modal để chỉnh sửa bài viết */}
      <Modal
        title="Edit Banned Post"
        visible={isModalVisible}
        onCancel={handleClose}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please input the content!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: "Please input the author!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please input the date!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Post
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Banned;
