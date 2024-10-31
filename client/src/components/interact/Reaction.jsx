import React, { useState } from "react";
import { Tooltip } from "antd";
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
    const [visible, setVisible] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const handleMouseEnter = () => {
        setVisible(true);
    };

    const handleMouseLeave = () => {
        setVisible(false);
        setShowPicker(false);
    };

    const handleReactionClick = (type) => {
        if (selectedReaction === type) {
            setSelectedReaction(null);
        } else {
            setSelectedReaction(type);
        }

        if (onReaction) {
            onReaction(type);
        }
    };

    const handleEmojiSelect = (emoji) => {
        setSelectedReaction(emoji.id);
        if (onReaction) {
            onReaction(emoji.id);
        }
        setShowPicker(false);
    };

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: "pointer" }}>
            {visible ? (
                <div style={{ display: "flex", gap: "5px" }}>
                    {reactions.map(({ type, emoji, icon }) => (
                        <Tooltip title={type.charAt(0).toUpperCase() + type.slice(1)} key={type}>
                            <span
                                onClick={() => handleReactionClick(type)}
                                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                            >
                                <span style={{ fontSize: "1 rem" }}>
                                    {selectedReaction === type ? emoji : icon}
                                </span>
                                <span style={{ marginLeft: "5px" }}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            </span>
                        </Tooltip>
                    ))}
                    {showPicker && (
                        <div style={{ position: "absolute", zIndex: 1000 }}>
                            <Picker onSelect={handleEmojiSelect} />
                        </div>
                    )}
                </div>
            ) : (
                <span>
                    {selectedReaction ? (
                        <span style={{ fontSize: "1 rem", color: "#1890ff" }}>
                            {reactions.find((r) => r.type === selectedReaction)?.emoji}
                        </span>
                    ) : (
                        <span style={{ fontSize: "1 rem" }}>
                            <LikeOutlined /> {/* Default icon when no reaction is selected */}
                        </span>
                    )}
                    <span style={{ marginLeft: "5px" }}>
                        {selectedReaction ? selectedReaction.charAt(0).toUpperCase() + selectedReaction.slice(1) : "Like"}
                    </span>
                </span>
            )}
        </div>
    );
}
