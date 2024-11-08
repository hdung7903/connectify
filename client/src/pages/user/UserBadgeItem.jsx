import { Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";

const UserBadgeItem = ({ handleFunction, admin }) => {
  const { user } = useAuth();

  return (
    <Tag
      color={admin === user._id ? "volcano" : "blue"}
      closable
      onClose={handleFunction}
      style={{
        cursor: "pointer",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
        padding: "5px 10px",
        borderRadius: "20px",
      }}
    >
      {user.username}
      {admin === user._id && <span> (Admin)</span>}
      <CloseOutlined style={{ marginLeft: "4px" }} />
    </Tag>
  );
};

export default UserBadgeItem;
