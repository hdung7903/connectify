import { Avatar, Tooltip } from "antd";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./config/ChatLogics";
import { useAuth } from "../../contexts/AuthContext";
import "./ScrollableChat.css";

const ScrollableChat = ({ messages }) => {
  const { user } = useAuth();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <div
              key={m?._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  m.sender?._id === user?._id ? "flex-end" : "flex-start",
                marginTop: isSameUser(messages, m, i, user?._id) ? 2 : 20,
                flexDirection:
                  m.sender?._id === user?._id ? "row-reverse" : "row",
              }}
            >
              {(isSameSender(messages, m, i, user?._id) ||
                isLastMessage(messages, i, user?._id)) && (
                <Tooltip
                  title={m.sender?.username || "Unknown User"}
                  placement="bottom"
                >
                  <Avatar
                    src={
                      m.sender?.avatarUrl || "https://via.placeholder.com/150"
                    }
                    style={{
                      marginRight: m.sender?._id === user?._id ? "0" : "8px",
                      marginLeft: m.sender?._id === user?._id ? "8px" : "0",
                      border: "2px solid #0078FF",
                    }}
                    size="small"
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor:
                    m.sender?._id === user?._id ? "#0078FF" : "#E5E5EA",
                  padding: "10px 15px",
                  borderRadius:
                    m.sender?._id === user?._id
                      ? "20px 20px 0px 20px"
                      : "20px 20px 20px 0px",
                  maxWidth: "75%",
                  wordBreak: "break-word",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  color: m.sender?._id === user?._id ? "#FFF" : "#333",
                  marginLeft:
                    m.sender?._id === user?._id
                      ? "auto"
                      : isSameSenderMargin(messages, m, i, user?._id),
                  marginRight:
                    m.sender?._id === user?._id
                      ? 0
                      : isSameSenderMargin(messages, m, i, user?._id),
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
