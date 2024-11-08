import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Spin, Tooltip } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { ChatState } from "../../contexts/ChatProvider";
import ScrollableChat from "./ScrollableChat";
import ProfileModal from "./ProfileModal";
import { getSender } from "./config/ChatLogics";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import io from "socket.io-client";
import "./SingleChat.css";
import { useAuth } from "../../contexts/AuthContext";
const ENDPOINT = import.meta.env.VITE_BACKEND_URL || "http://localhost:9999";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedChat, setSelectedChat } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  const { user } = useAuth();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };

      const { data } = await axios.get(
        `${ENDPOINT}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        };
        const messageToSend = { content: newMessage, chatId: selectedChat._id };
        setNewMessage("");
        const { data } = await axios.post(
          `${ENDPOINT}/api/message`,
          messageToSend,
          config
        );

        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Notification handling
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [selectedChatCompare]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="singleChat-container">
      {selectedChat ? (
        <>
          <div className="singleChat-header">
            <Button
              onClick={() => setSelectedChat(null)}
              icon={<ArrowLeftOutlined />}
            >
              Quay lại
            </Button>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {!selectedChat.isGroupChat
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName.toUpperCase()}
            </Typography.Title>
            {selectedChat.isGroupChat && (
              <Tooltip title="Edit group">
                <Button icon={<EditOutlined />} onClick={openModal} />
              </Tooltip>
            )}
          </div>

          {loading ? (
            <Spin />
          ) : (
            <div className="singleChat-messages">
              <ScrollableChat messages={messages} />
            </div>
          )}

          <div className="singleChat-input">
            <Input
              placeholder="Enter a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={sendMessage}
              className="input-box"
            />
          </div>

          {selectedChat.isGroupChat && (
            <UpdateGroupChatModal
              fetchMessages={fetchMessages}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              isOpen={isModalOpen}
              onClose={closeModal}
            />
          )}
        </>
      ) : (
        <p>Chưa chọn cuộc trò chuyện nào</p>
      )}
    </div>
  );
};

export default SingleChat;
