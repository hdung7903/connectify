import React, { useState } from "react";
import {
  Space,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
  Checkbox,
} from "antd";

const ViewListUser = () => {
  const [data, setData] = useState([
    {
      key: "1",
      id: "001",
      name: "John Brown",
      email: "john.brown@example.com",
      tags: ["active", "developer"],
    },
    {
      key: "2",
      id: "002",
      name: "Jim Green",
      email: "jim.green@example.com",
      tags: ["inactive"],
    },
    {
      key: "3",
      id: "003",
      name: "Joe Black",
      email: "joe.black@example.com",
      tags: ["active", "teacher"],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null); // For view detail modal
  const [isViewModalVisible, setIsViewModalVisible] = useState(false); // State for view modal

  const [form] = Form.useForm();
  const { confirm } = Modal;

  const tagOptions = ["active", "inactive", "developer", "teacher"];

  // Handle showing the modal for adding a new user or editing existing user
  const showAddUserModal = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditUserModal = (record) => {
    setIsEditMode(true);
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Handle showing the modal for viewing user details
  const showViewDetailModal = (record) => {
    setViewingUser(record);
    setIsViewModalVisible(true);
  };

  // Handle adding a new user
  const handleAddUser = (values) => {
    const newData = {
      key: Date.now().toString(), // unique key
      ...values,
    };
    setData([...data, newData]);
    message.success("User added successfully");
    setIsModalVisible(false);
  };

  // Handle editing a user
  const handleEditUser = (values) => {
    const newData = data.map((item) =>
      item.key === editingUser.key ? { ...item, ...values } : item
    );
    setData(newData);
    message.success("User updated successfully");
    setIsModalVisible(false);
  };

  // Handle deleting a user
  const handleDelete = (key) => {
    confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setData(data.filter((item) => item.key !== key));
        message.success("User deleted successfully");
      },
      onCancel() {
        message.info("User deletion cancelled");
      },
    });
  };

  // Form submit handler
  const handleSubmit = (values) => {
    if (isEditMode) {
      handleEditUser(values);
    } else {
      handleAddUser(values);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag === "inactive" ? "volcano" : "green";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showViewDetailModal(record)}>View</a>
          <a onClick={() => showEditUserModal(record)}>Edit</a>
          <a onClick={() => handleDelete(record.key)}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={showAddUserModal}>
        Add User
      </Button>
      <Table columns={columns} dataSource={data} style={{ marginTop: 20 }} />

      {/* Modal for Add/Edit */}
      <Modal
        title={isEditMode ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="id"
            label="ID"
            rules={[{ required: true, message: "Please input user ID!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input user name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tags"
            label="Tags"
            rules={[
              { required: true, message: "Please select at least one tag!" },
            ]}
          >
            <Checkbox.Group options={tagOptions} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for View Details */}
      <Modal
        title="User Details"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {viewingUser && (
          <div>
            <p>
              <strong>ID: </strong> {viewingUser.id}
            </p>
            <p>
              <strong>Name: </strong> {viewingUser.name}
            </p>
            <p>
              <strong>Email: </strong> {viewingUser.email}
            </p>
            <p>
              <strong>Tags: </strong> {viewingUser.tags.join(", ")}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ViewListUser;
