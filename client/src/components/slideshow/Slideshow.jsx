import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './slideshow.css';

export default function Slideshow(props) {
    const [idx, setIdx] = React.useState(0);

    function nextImg() {
        setIdx((idx + 1) % props.images.length);
    }

    function prevImg() {
        const newIdx = (idx - 1 + props.images.length) % props.images.length;
        setIdx(newIdx);
    }

    return (
        <div className="slideshow">
            <img src={props.images[idx]} alt="" />
            <div className="slideshow-controls">
                <LeftOutlined onClick={prevImg} className="prevImg" style={{ fontSize: '24px', cursor: 'pointer' }} />
                <RightOutlined onClick={nextImg} className="nextImg" style={{ fontSize: '24px', cursor: 'pointer' }} />
            </div>
        </div>
    );
}
