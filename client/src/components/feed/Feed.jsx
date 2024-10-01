import React from 'react';
import Post from '../post/Post';
import fakeData from './fakeData.json';

export default function Feed() {
    return (
        <div>
            {fakeData.posts.map(post => {
                // Find the user based on userId for avatar and name
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
                        avatar={user?.avatar} // Use optional chaining to avoid errors if user is not found
                        first_name={user?.first_name} // Use optional chaining
                        last_name={user?.last_name} // Use optional chaining
                    />
                );
            })}
        </div>
    );
}
