import { Card } from "antd";
import SingleChat from "./SingleChat";
import { useState } from "react";
import { ChatState } from "../../contexts/ChatProvider";

const Chatbox = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { selectedChat } = ChatState();

  return (
    <Card
      style={{
        display: selectedChat ? "flex" : "none",
        flexDirection: "column",
        padding: "16px",
        backgroundColor: "#FFF",
        width: "100%",
        maxWidth: "1280px",
        borderRadius: "8px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Card>
  );
};

export default Chatbox;
