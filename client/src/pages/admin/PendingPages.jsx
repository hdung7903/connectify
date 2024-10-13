import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const initialPendingData = [
  {
    id: 1,
    title: "Pending Page 1",
    content: "Content for Pending Page 1...",
    author: "Pending Author 1",
    date: "2023-10-01",
  },
  {
    id: 2,
    title: "Pending Page 2",
    content: "Content for Pending Page 2...",
    author: "Pending Author 2",
    date: "2023-10-05",
  },
];

const PendingPages = () => {
  const [pendingPages, setPendingPages] = useState(initialPendingData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [form] = Form.useForm();

  // Hàm mở modal để chỉnh sửa trang
  const showModal = (page) => {
    setSelectedPage(page);
    form.setFieldsValue(page);
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedPage(null);
    form.resetFields();
  };

  // Hàm xử lý lưu trang (chỉnh sửa)
  const handleFinish = (values) => {
    setPendingPages((prevPages) =>
      prevPages.map((page) =>
        page.id === selectedPage.id ? { ...page, ...values } : page
      )
    );
    handleClose();
  };

  // Hàm xóa trang
  const handleDelete = (id) => {
    setPendingPages((prevPages) => prevPages.filter((page) => page.id !== id));
  };

  // Hàm xử lý phê duyệt trang
  const handleApprove = (id) => {
    // Thực hiện logic phê duyệt ở đây, có thể chuyển đến danh sách đã phê duyệt hoặc xóa
    setPendingPages((prevPages) => prevPages.filter((page) => page.id !== id));
    // Có thể hiển thị thông báo hoặc xử lý thêm
    console.log(`Page with ID ${id} has been approved.`);
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
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record.id)}
          >
            Approve
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Pending Pages List</h2>
      <Table columns={columns} dataSource={pendingPages} rowKey="id" />

      {/* Modal để chỉnh sửa trang */}
      <Modal
        title="Edit Pending Page"
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
              Update Page
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PendingPages;
