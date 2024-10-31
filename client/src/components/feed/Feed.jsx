import React, { useEffect, useState } from 'react';
import Post from '../post/Post';
import api from '../../services/axios';

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get("/posts/home", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                if (response.data) {
                    const enrichedPosts = await Promise.all(
                        response.data.map(async (post) => {
                            // Fetch user data using ownerId (which is the userId in this case)
                            try {
                                const userResponse = await api.get(`/posts/user/${post.ownerId}`, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                                    }
                                });
                                const userData = userResponse.data;

                                return {
                                    ...post,
                                    avatarUrl: userData.avatarUrl || 'https://placeholder.co/40x40', // Fallback avatar
                                    username: userData.username || 'Anonymous', // Fallback username
                                };
                            } catch (error) {
                                console.error(`Error fetching user data for post ${post._id}:`, error);
                                return {
                                    ...post,
                                    avatarUrl: 'https://placeholder.co/40x40', // Fallback avatar on error
                                    username: 'Anonymous', // Fallback username on error
                                };
                            }
                        })
                    );

                    setPosts(enrichedPosts);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <p>Loading feed...</p>;

    return (
        <div>
            {posts.length > 0 ? (
                posts.map(post => (
                    <Post
                        key={post._id}
                        id={post._id}
                        ownerId={post.ownerId}
                        title={post.title}
                        content={post.content}
                        media={post.media}
                        likesCount={post.likesCount}
                        reactions={post.reactions}
                        visibility={post.visibility}
                        createdAt={post.createdAt}
                        updatedAt={post.updatedAt}
                        username={post.username}
                        avatarUrl={post.avatarUrl}
                    />
                ))
            ) : (
                <p>No posts to display.</p>
            )}
        </div>
    );
}
