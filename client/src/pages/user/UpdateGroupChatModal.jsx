import { Modal, Button, Input, Typography, Spin, message } from "antd";
import { useState } from "react";
import { ChatState } from "../../contexts/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const { Title } = Typography;

const UpdateGroupChatModal = ({
  fetchMessages,
  fetchAgain,
  setFetchAgain,
  isOpen,
  onClose,
}) => {
  const { selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const { user } = useAuth();

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
        `http://localhost:9999/users/getUser?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      message.error("Failed to load the search results");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:9999/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName(""); // Clear input after renaming
      message.success("Group name updated!");
    } catch (error) {
      message.error(error.response.data.message || "Failed to rename group");
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (!user1 || !user1.userId) {
      message.error("Invalid user");
      return;
    }
    console.log("user", user1);
    if (selectedChat.users.find((u) => u._id === user1.userId)) {
      message.error("User already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      message.error("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:9999/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
      message.success("User added to group!");
    } catch (error) {
      message.error(error.response.data.message || "Failed to add user");
      setLoading(false);
    }
    setSearch(""); // Clear search input after adding user
  };

  const handleRemove = async (user1) => {
    if (!user1 || !user1._id) {
      message.error("Invalid user");
      return;
    }

    // Chỉ cho phép admin hoặc chính người dùng tự rời nhóm
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      message.error("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:9999/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      // Nếu người dùng tự rời khỏi nhóm, xóa cuộc trò chuyện khỏi giao diện
      if (user1._id === user._id) {
        setSelectedChat(null);
      } else {
        setSelectedChat(data);
      }
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
      message.success("User removed from group!");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to remove user");
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Update Group Chat"
      visible={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Title level={4}>{selectedChat?.chatName || "Group Chat"}</Title>
      <div style={{ marginBottom: 16 }}>
        {selectedChat?.users?.map((u) => (
          <UserBadgeItem
            key={u._id}
            user={u}
            admin={selectedChat.groupAdmin}
            handleFunction={() => handleRemove(u)}
          />
        ))}
      </div>
      <Input
        placeholder="Chat Name"
        value={groupChatName}
        onChange={(e) => setGroupChatName(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button
        type="primary"
        loading={renameloading}
        onClick={handleRename}
        style={{ marginBottom: 16 }}
      >
        Update Name
      </Button>
      <Input
        placeholder="Add User to group"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      {loading ? (
        <Spin />
      ) : (
        searchResult?.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            handleFunction={() => handleAddUser(user)}
          />
        ))
      )}
      <Button onClick={() => handleRemove(user)}>Leave Group</Button>
    </Modal>
  );
};

export default UpdateGroupChatModal;
