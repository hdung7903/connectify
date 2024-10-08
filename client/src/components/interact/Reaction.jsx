import React, { useState } from 'react';
import { LikeOutlined, LikeFilled, HeartOutlined, HeartFilled, SmileOutlined, SmileFilled, MehOutlined, MehFilled, FrownOutlined, FrownFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';

const reactions = [
    { type: 'like', icon: LikeOutlined, filledIcon: LikeFilled },
    { type: 'love', icon: HeartOutlined, filledIcon: HeartFilled },
    { type: 'haha', icon: SmileOutlined, filledIcon: SmileFilled },
    { type: 'wow', icon: MehOutlined, filledIcon: MehFilled },
    { type: 'sad', icon: FrownOutlined, filledIcon: FrownFilled },
];

export default function Reaction({ onReaction }) {
    const [selectedReaction, setSelectedReaction] = useState('like');
    const [visible, setVisible] = useState(false);

    const handleMouseEnter = () => {
        setVisible(true);
    };

    const handleMouseLeave = () => {
        setVisible(false);
    };

    const handleReactionClick = (type) => {
        setSelectedReaction(type);
        if (onReaction) {
            onReaction(type);
        }
    };

    const currentReaction = reactions.find(r => r.type === selectedReaction);

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }}>
            {visible ? (
                <div style={{ display: 'flex', gap: '5px' }}>
                    {reactions.map(({ type, icon: Icon, filledIcon: FilledIcon }) => (
                        <Tooltip title={type.charAt(0).toUpperCase() + type.slice(1)} key={type}>
                            <span onClick={() => handleReactionClick(type)} style={{ cursor: 'pointer' }}>
                                {selectedReaction === type ? <FilledIcon /> : <Icon />}
                            </span>
                        </Tooltip>
                    ))}
                </div>
            ) : (
                <span>
                    {currentReaction ? <currentReaction.filledIcon /> : 'React'}
                    {selectedReaction.charAt(0).toUpperCase() + selectedReaction.slice(1)}
                </span>
            )}
        </div>
    );
}
