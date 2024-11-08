import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  List,
  Input,
  Button,
  Typography,
  Spin,
  notification,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import "../../style/chat.css";
import { ChatState } from "../../contexts/ChatProvider";
import UserListItem from "./UserListItem";
import GroupChatModal from "./GroupChatModal";
import axios from "axios";
import Chatbox from "./ChatBox";
import _ from "lodash";
import { useAuth } from "../../contexts/AuthContext";

const { Sider, Content } = Layout;
const { Text } = Typography;

function Chat() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setSelectedChat, selectedChat, chats, setChats } = ChatState() || {};
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useAuth();

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleSearch = async (searchValue) => {
    if (!searchValue) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await axios.get(
        `http://localhost:9999/users/getUser?search=${searchValue}`,
        config
      );
      setSearchResult(data);
    } catch (error) {
      notification.error({
        message: "Error Occurred!",
        description: "Failed to Load the Search Results",
        duration: 5,
        placement: "bottomLeft",
      });
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = useCallback(_.debounce(handleSearch, 500), []);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    debounceSearch(e.target.value);
  };

  const accessChat = async (userId) => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:9999/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats((prevChats) => [data, ...prevChats]);
      }
      setSelectedChat(data);
    } catch (error) {
      notification.error({
        message: "Error fetching the chat",
        description:
          error.message || "An error occurred while fetching the chat.",
        duration: 5,
        placement: "bottomLeft",
      });
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          `http://localhost:9999/api/chat`,
          config
        );
        setChats(data);
      } catch (error) {
        notification.error({
          message: "Failed to Load Chats",
          description:
            error.message || "An error occurred while fetching chats.",
          duration: 5,
          placement: "bottomLeft",
        });
      }
    };

    fetchChats();

    return () => {
      debounceSearch.cancel();
    };
  }, [fetchAgain, debounceSearch]);

  return (
    <Layout className="chat-layout">
      <Sider width={300} theme="light" className="chat-sider">
        <div className="chat-header">
          <Text strong>Chats</Text>
          <GroupChatModal>
            <Button icon={<PlusOutlined />} type="primary" shape="circle" />
          </GroupChatModal>
        </div>

        <div style={{ paddingBottom: "16px" }}>
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={onSearchChange}
            style={{ marginRight: "8px" }}
            suffix={<SearchOutlined />}
          />
        </div>

        {loading ? (
          <Spin />
        ) : (
          <List
            locale={{emptyText:null}}
            dataSource={Array.isArray(searchResult) ? searchResult : []}
            renderItem={(user) =>
              user && user._id ? (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ) : null
            }
          />
        )}

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {chats && chats.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={chats}
              locale={{emptyText:null}}
              renderItem={(chat) =>
                chat && chat.users ? (
                  <List.Item
                    onClick={() => handleSelectChat(chat)}
                    style={{
                      background: selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                      color: selectedChat === chat ? "white" : "black",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <Text>
                          {!chat.isGroupChat
                            ? chat.users
                                ?.map((u) => u?.username || "Unnamed User")
                                .join(", ") || "No Users"
                            : chat.chatName}
                        </Text>
                      }
                      description={
                        chat.latestMessage && chat.latestMessage.content ? (
                          <Text>
                            <b>
                              {chat.latestMessage.sender?.username || "Unknown"}
                              :{" "}
                            </b>
                            {chat.latestMessage.content.length > 50
                              ? chat.latestMessage.content.substring(0, 51) +
                                "..."
                              : chat.latestMessage.content}
                          </Text>
                        ) : null
                      }
                    />
                  </List.Item>
                ) : null
              }
            />
          ) : (
            <Text>No chats available</Text>
          )}
        </div>
      </Sider>

      <Layout>
        <Content className="chat-content" style={{ overflowY: "auto" }}>
          <div className="chat-messages">
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Chat;
