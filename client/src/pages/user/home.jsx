import React, { useState } from 'react';
import Feed from '../../components/feed/Feed';
import PostCreate from '../../components/postCreate/postCreate';
import './home.css';

export default function Home() {
    const [feedKey, setFeedKey] = useState(0);
    const userId = null;

    return (
        <div className="home" style={{ display: 'flex', width: '100%' }}>
            <div className="left" style={{ flex: '25%', padding: '1rem' }}>
                <h2>Group</h2>
                <p>Temporary Group Component</p>
            </div>
            <div className="center" style={{ flex: '50%', padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <PostCreate onPost={() => setFeedKey(feedKey + 1)} />
                </div>
                <Feed userId={userId} key={feedKey} />
            </div>
            <div className="right" style={{ flex: '25%', padding: '1rem' }}>
                <h2>Friends</h2>
                <p>Temporary Friends Component</p>
            </div>
        </div>
    );
}
