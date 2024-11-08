import React, { useState } from 'react';
import { Modal, Button, Input, Avatar, Typography } from 'antd';
import api from '../../services/axios';
import { useAuth } from '../../contexts/AuthContext';

const { TextArea } = Input;
const { Text } = Typography;

export default function SharePost({ showShareModal, closeShareModal, postId, refreshPosts }) {
    const { user } = useAuth();
    const [shareMessage, setShareMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShare = async () => {
        setLoading(true);

        try {
            console.log("Sharing post with postId:", postId);
            console.log("Creating a shared post with content:", shareMessage);
            await api.post('/posts/share', { postId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            await api.post('/posts/', {
                title: 'Post share',
                content: shareMessage || null,
                sharedPostId: postId,
                visibility: 'public'
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });

            refreshPosts();
            closeShareModal();
        } catch (error) {
            console.error("Failed to share post:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Share this Post"
            open={showShareModal}
            onClose={closeShareModal}
            footer={[
                <Button key="back" onClick={closeShareModal}>
                    Cancel
                </Button>,
                <Button key="share" type="primary" onClick={handleShare} loading={loading} htmlType="submit">
                    Share
                </Button>,
            ]}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Avatar src={user.avatarUrl} alt={user.username} size="large" />
                <Text style={{ marginLeft: '10px', fontWeight: 'bold' }}>{user.username}</Text>
            </div>
            <TextArea
                placeholder="What do you think about this post?"
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                rows={4}
            />
        </Modal>
    );
}
