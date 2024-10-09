import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const initialData = [
  {
    id: 1,
    title: "Page 1",
    content: "Content for Page 1...",
    author: "Author 1",
    date: "2023-10-01",
  },
  {
    id: 2,
    title: "Page 2",
    content: "Content for Page 2...",
    author: "Author 2",
    date: "2023-10-05",
  },
  {
    id: 3,
    title: "Page 3",
    content: "Content for Page 3...",
    author: "Author 3",
    date: "2023-10-09",
  },
];

const ViewPages = () => {
  const [pages, setPages] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [form] = Form.useForm();

  // Hàm mở modal để thêm hoặc sửa trang
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

  // Hàm xử lý lưu trang (thêm hoặc sửa)
  const handleFinish = (values) => {
    if (selectedPage) {
      // Cập nhật trang
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.id === selectedPage.id ? { ...page, ...values } : page
        )
      );
    } else {
      // Thêm trang mới
      const newPage = { ...values, id: pages.length + 1 };
      setPages((prevPages) => [...prevPages, newPage]);
    }
    handleClose();
  };

  // Hàm xóa trang
  const handleDelete = (id) => {
    setPages((prevPages) => prevPages.filter((page) => page.id !== id));
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
      <h2>Pages List</h2>

      <Table columns={columns} dataSource={pages} rowKey="id" />

      {/* Modal để thêm/sửa trang */}
      <Modal
        title={selectedPage ? "Edit Page" : "Add Page"}
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
              {selectedPage ? "Update Page" : "Add Page"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewPages;
