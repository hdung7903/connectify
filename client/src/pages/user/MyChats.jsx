import React, { useEffect, useState } from "react";
import { List, Typography, Avatar, notification } from "antd";
import { ChatState } from "../../contexts/ChatProvider";
import "./MyChats.css";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const { Text } = Typography;

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useAuth();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:9999/api/chat",
        config
      );
      console.log("Fetched chats data:", data); // Kiểm tra dữ liệu trả về từ API
      setChats(data);
    } catch (error) {
      console.error("API fetch error:", error); // Thêm dòng này để log lỗi
      notification.error({
        message: "Error Occurred!",
        description: "Failed to Load the chats",
        duration: 5,
        placement: "bottomLeft",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="my-chats-container">
      <Text className="my-chats-title">My Chats</Text>
      <div className="chats-list-container">
        {chats && chats.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={chats}
            renderItem={(chat) =>
              chat && chat.users ? (
                <List.Item
                  locale={{emptyText:null}}
                  onClick={() => setSelectedChat(chat)}
                  className={`chat-item ${selectedChat === chat ? "selected-chat" : ""
                    }`}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={
                          !chat.isGroupChat && chat.users[0]?.avatarUrl
                            ? chat.users[0].avatarUrl
                            : "https://via.placeholder.com/150"
                        }
                      />
                    }
                    title={
                      <span className="chat-username">
                        {!chat.isGroupChat
                          ? chat.users.map((u) => u.username).join(", ")
                          : chat.chatName}
                      </span>
                    }
                    description={
                      chat.latestMessage && (
                        <Text>
                          <b className="text-center">
                            {chat.latestMessage.sender.name}:{" "}
                          </b>
                          {chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) + "..."
                            : chat.latestMessage.content}
                        </Text>
                      )
                    }
                  />
                </List.Item>
              ) : null
            }
          />
        ) : null}
      </div>
    </div>
  );
};

export default MyChats;
