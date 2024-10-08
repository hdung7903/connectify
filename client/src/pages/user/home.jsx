import React, { useState } from 'react';
import Feed from '../../components/feed/Feed';
import PostCreate from '../../components/postCreate/postCreate';
import './home.css';

export default function Home() {
    const [feedKey, setFeedKey] = useState(0);
    const [newPost, setNewPost] = useState(null);
    const userId = null;

    const handleNewPost = (post) => {
        setNewPost(post);
        setFeedKey(feedKey + 1);
    };

    return (
        <div className="home" style={{ display: 'flex', width: '100%' }}>
            <div className="left" style={{ flex: '25%', padding: '1rem' }}>
                <h2>Group</h2>
                <p>Temporary Group Component</p>
            </div>
            <div className="center" style={{ flex: '50%', padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <PostCreate onPost={handleNewPost} />
                </div>
                <Feed userId={userId} key={feedKey} newPost={newPost} />
            </div>
            <div className="right" style={{ flex: '25%', padding: '1rem' }}>
                <h2>Friends</h2>
                <p>Temporary Friends Component</p>
            </div>
        </div>
    );
}
