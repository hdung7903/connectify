import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []); // Thêm mảng phụ thuộc rỗng để chỉ chạy một lần

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, setChats, chats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
