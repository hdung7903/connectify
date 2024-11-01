import React, { useState } from "react";
import { Popover, Tooltip } from "antd";
import { Picker } from "emoji-mart";
import {
    LikeOutlined,
    HeartOutlined,
    SmileOutlined,
    MehOutlined,
    FrownOutlined,
} from '@ant-design/icons';

const reactions = [
    { type: "like", emoji: "👍", icon: <LikeOutlined /> },
    { type: "love", emoji: "❤️", icon: <HeartOutlined /> },
    { type: "haha", emoji: "😄", icon: <SmileOutlined /> },
    { type: "wow", emoji: "😲", icon: <MehOutlined /> },
    { type: "sad", emoji: "😢", icon: <FrownOutlined /> },
];

export default function Reaction({ onReaction }) {
    const [selectedReaction, setSelectedReaction] = useState(null);
    const [showPicker, setShowPicker] = useState(false);

    const handleReactionClick = (type) => {
        const newReaction = selectedReaction === type ? null : type;
        setSelectedReaction(newReaction);

        if (onReaction) {
            onReaction(newReaction);
        }
    };

    const handleEmojiSelect = (emoji) => {
        setSelectedReaction(emoji.id);
        if (onReaction) {
            onReaction(emoji.id);
        }
        setShowPicker(false);
    };

    const popoverContent = (
        <div style={{ display: "flex", gap: "5px" }}>
            {reactions.map(({ type, emoji, icon }) => (
                <Tooltip title={type.charAt(0).toUpperCase() + type.slice(1)} key={type}>
                    <span
                        onClick={() => handleReactionClick(type)}
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.5rem",
                            color: selectedReaction === type ? "#1890ff" : "inherit",
                        }}
                    >
                        {selectedReaction === type ? emoji : icon}
                    </span>
                </Tooltip>
            ))}
            {showPicker && (
                <div style={{ position: "absolute", zIndex: 1000 }}>
                    <Picker onSelect={handleEmojiSelect} />
                </div>
            )}
        </div>
    );

    return (
        <Popover content={popoverContent} trigger="hover" placement="top">
            <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                {selectedReaction ? (
                    <span style={{ fontSize: "1.5rem", color: "#1890ff" }}>
                        {reactions.find((r) => r.type === selectedReaction)?.emoji}
                    </span>
                ) : (
                    <LikeOutlined style={{ fontSize: "1.5rem" }} /> // Default icon when no reaction is selected
                )}
                <span style={{ marginLeft: "5px" }}>
                    {selectedReaction ? selectedReaction.charAt(0).toUpperCase() + selectedReaction.slice(1) : "Like"}
                </span>
            </span>
        </Popover>
    );
}
