import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  notification,
  List,
  Avatar,
  Spin,
} from "antd";
import axios from "axios";
import { ChatState } from "../../contexts/ChatProvider";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import { useAuth } from "../../contexts/AuthContext";

const GroupChatModal = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { chats, setChats } = ChatState();
  const { user } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      notification.warning({
        message: "User already added",
        duration: 5,
        placement: "top",
      });
    } else {
      notification.success({
        message: "User added success",
        duration: 5,
        placement: "top",
      });
    }
    return setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:9999/users/getUser?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      notification.error({
        message: "Error Occurred!",
        description: "Failed to Load the Search Results",
        duration: 5,
        placement: "bottomLeft",
      });
      setLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      notification.warning({
        message: "Please fill all fields",
        duration: 5,
        placement: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:9999/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      closeModal();
      notification.success({
        message: "New Group Chat Created!",
        duration: 5,
        placement: "bottom",
      });
    } catch (error) {
      notification.error({
        message: "Failed to Create the Chat!",
        description: error.response?.data || "An error occurred",
        duration: 5,
        placement: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={openModal}>{children}</span>

      <Modal
        title="Create Group Chat"
        visible={isModalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText="Create Chat"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Chat Name">
            <Input
              placeholder="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Add Users (e.g., John, Piyush, Jane)">
            <Input
              placeholder="Add Users"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Form.Item>
          <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 10 }}>
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </div>
          {loading ? (
            <Spin />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={searchResult.slice(0, 4)}
              renderItem={(user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              )}
            />
          )}
        </Form>
      </Modal>
    </>
  );
};

export default GroupChatModal;
