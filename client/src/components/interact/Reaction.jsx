import React, { useState, useEffect } from "react";
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

export default function Reaction({ onReaction, selectedReaction }) {
    const [localSelectedReaction, setLocalSelectedReaction] = useState(selectedReaction);
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        setLocalSelectedReaction(selectedReaction);
    }, [selectedReaction]);

    const handleReactionClick = (type) => {
        const newReaction = localSelectedReaction === type ? null : type;
        setLocalSelectedReaction(newReaction);

        if (onReaction) {
            onReaction(newReaction);
        }
    };

    const handleEmojiSelect = (emoji) => {
        setLocalSelectedReaction(emoji.id);
        if (onReaction) {
            onReaction(emoji.id);
        }
        setShowPicker(false);
    };

    const reactionContent = (
        <div style={{ display: "flex", gap: "5px", padding: "10px" }}>
            {reactions.map(({ type, emoji, icon }) => (
                <Tooltip title={type.charAt(0).toUpperCase() + type.slice(1)} key={type}>
                    <span
                        onClick={() => handleReactionClick(type)}
                        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                        <span style={{ fontSize: "1rem" }}>
                            {localSelectedReaction === type ? emoji : icon}
                        </span>
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
        <Popover content={reactionContent} trigger="hover" placement="topLeft">
            <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                {localSelectedReaction ? (
                    <span style={{ fontSize: "1rem", color: "#1890ff" }}>
                        {reactions.find((r) => r.type === localSelectedReaction)?.emoji}
                    </span>
                ) : (
                    <span style={{ fontSize: "1rem" }}>
                        <LikeOutlined /> {/* Default icon when no reaction is selected */}
                    </span>
                )}
                <span style={{ marginLeft: "5px" }}>
                    {localSelectedReaction ? localSelectedReaction.charAt(0).toUpperCase() + localSelectedReaction.slice(1) : "Like"}
                </span>
            </span>
        </Popover>
    );
}
