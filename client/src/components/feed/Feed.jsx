import React, { useState, useEffect } from 'react';
import Post from '../post/Post';
import fakeData from './fakeData.json';

    export default function Feed({ newPost }) {
    const [posts, setPosts] = useState(fakeData.posts);

    useEffect(() => {
        if (newPost) {
            setPosts(prevPosts => [newPost, ...prevPosts]);
        }
    }, [newPost]);

    return (
        <div>
            {posts.map(post => {
                const user = fakeData.users.find(user => user.id === post.userId);

                return (
                    <Post
                        key={post.id}
                        id={post.id}
                        userId={post.userId}
                        text={post.text}
                        likes_num={post.likes_num}
                        liked={post.liked}
                        comments_num={post.comments_num}
                        created_at={post.created_at}
                        images={post.images}
                        avatar={user ? user.avatar : null}
                        first_name={user ? user.first_name : 'Unknown'}
                        last_name={user ? user.last_name : 'User'}
                    />
                );
            })}
        </div>
    );
}
