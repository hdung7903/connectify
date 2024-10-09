import React, { useState } from 'react';
import {
    LikeOutlined,
    LikeFilled,
    HeartOutlined,
    HeartFilled,
    SmileOutlined,
    SmileFilled,
    MehOutlined,
    MehFilled,
    FrownOutlined,
    FrownFilled
} from '@ant-design/icons';
import { Tooltip } from 'antd';

const reactions = [
    { type: 'like', icon: LikeOutlined, filledIcon: LikeFilled },
    { type: 'love', icon: HeartOutlined, filledIcon: HeartFilled },
    { type: 'haha', icon: SmileOutlined, filledIcon: SmileFilled },
    { type: 'wow', icon: MehOutlined, filledIcon: MehFilled },
    { type: 'sad', icon: FrownOutlined, filledIcon: FrownFilled },
];

export default function Reaction({ onReaction }) {
    const [selectedReaction, setSelectedReaction] = useState(null);
    const [visible, setVisible] = useState(false);

    const handleMouseEnter = () => {
        setVisible(true);
    };

    const handleMouseLeave = () => {
        setVisible(false);
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

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }}>
            {visible ? (
                <div style={{ display: 'flex', gap: '5px' }}>
                    {reactions.map(({ type, icon: Icon, filledIcon: FilledIcon }) => (
                        <Tooltip title={type.charAt(0).toUpperCase() + type.slice(1)} key={type}>
                            <span
                                onClick={() => handleReactionClick(type)}
                                style={{ cursor: 'pointer', color: selectedReaction === type ? '#1890ff' : 'inherit', display: 'flex', alignItems: 'center' }}
                            >
                                {selectedReaction === type ? <FilledIcon style={{ color: '#1890ff' }} /> : <Icon />}
                                <span style={{ marginLeft: '5px' }}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            </span>
                        </Tooltip>
                    ))}
                </div>
            ) : (
                <span>
                    {selectedReaction ? (
                        React.createElement(reactions.find(r => r.type === selectedReaction)?.filledIcon || LikeOutlined, { style: { color: '#1890ff' } })
                    ) : (
                        <LikeOutlined />
                    )}
                    <span style={{ marginLeft: '5px' }}>{selectedReaction ? selectedReaction.charAt(0).toUpperCase() + selectedReaction.slice(1) : 'Like'}</span>
                </span>
            )}
        </div>
    );
}
