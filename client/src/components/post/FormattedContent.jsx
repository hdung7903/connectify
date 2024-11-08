import React, { useState, useEffect } from 'react';
import { Card, Skeleton } from 'antd';
import api from "../../services/axios";

const LinkPreview = ({ url, showPreview = true }) => {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPreview = async () => {
            if (!showPreview) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/api/link-preview?url=${encodeURIComponent(url)}`);
                setPreview(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (url) {
            fetchPreview();
        }
    }, [url, showPreview]);

    if (!showPreview || error || !preview) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                {url}
            </a>
        );
    }

    if (loading) {
        return (
            <Card className="my-4">
                <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
        );
    }

    return (
        <Card
            className="my-4 hover:shadow-md transition-shadow duration-200"
            style={{ padding: '12px' }}
        >
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-inherit"
            >
                <div className="flex">
                    {preview.image && (
                        <div className="flex-shrink-0 w-32 h-32">
                            <img
                                src={preview.image}
                                alt={preview.title || 'Link preview'}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <div className={`flex-grow ${preview.image ? 'ml-4' : ''}`}>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                            {preview.title || url}
                        </h4>
                        {preview.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {preview.description}
                            </p>
                        )}
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            <img
                                src={preview.favicon || '/api/placeholder/16/16'}
                                alt=""
                                className="w-4 h-4 mr-2"
                            />
                            {preview.siteName || new URL(url).hostname}
                        </div>
                    </div>
                </div>
            </a>
        </Card>
    );
};

const FormattedContent = ({ content, hasMedia = false }) => {
    // URL regex pattern
    const urlPattern = /(https?:\/\/[^\s]+)/g;

    const renderContent = (text) => {
        if (!text) return null;

        // Extract unique URLs from the text
        const urls = [...new Set(text.match(urlPattern) || [])];
        let lastIndex = 0;
        const parts = [];

        // Create a map of URL occurrences to handle replacements
        const urlMap = new Map();
        urls.forEach(url => {
            const regex = new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            let match;
            while ((match = regex.exec(text)) !== null) {
                urlMap.set(match.index, {
                    url,
                    end: match.index + url.length
                });
            }
        });

        // Sort URL positions
        const positions = Array.from(urlMap.entries())
            .sort(([a], [b]) => a - b);

        positions.forEach(([start, { url, end }], index) => {
            // Add text before the URL
            if (start > lastIndex) {
                parts.push(
                    <span key={`text-${index}`}>
                        {text.substring(lastIndex, start)}
                    </span>
                );
            }

            // Add the URL
            parts.push(
                <a
                    key={`link-${index}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    {url}
                </a>
            );

            lastIndex = end;
        });

        // Add any remaining text
        if (lastIndex < text.length) {
            parts.push(
                <span key="text-final">
                    {text.substring(lastIndex)}
                </span>
            );
        }

        return (
            <>
                <p>{parts}</p>
                {!hasMedia && urls.map((url, index) => (
                    <LinkPreview
                        key={`preview-${index}`}
                        url={url}
                        showPreview={!hasMedia}
                    />
                ))}
            </>
        );
    };

    return <div className="formatted-content">{renderContent(content)}</div>;
};

export default FormattedContent;