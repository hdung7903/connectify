const linkRegex = /(https?:\/\/[^\s]+)/g;

const extractLinks = (content) => {
    const links = content.match(linkRegex) || [];
    return links;
};

const formatContent = (content) => {
    const links = extractLinks(content);
    let formattedContent = content;

    links.forEach(link => {
        let type = 'link';
        let thumbnailUrl = null;

        // Detect YouTube links
        if (link.includes('youtube.com/watch') || link.includes('youtu.be/')) {
            type = 'youtube';
            // Extract video ID
            const videoId = link.includes('youtube.com/watch')
                ? new URL(link).searchParams.get('v')
                : link.split('/').pop().split('?')[0];
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
        }

        formattedContent = formattedContent.replace(link, `[${type}]${link}[/${type}]`);
    });

    return {
        formattedContent,
        links: links.map(link => ({
            url: link,
            type: link.includes('youtube.com/watch') || link.includes('youtu.be/') ? 'youtube' : 'link',
            thumbnailUrl: link.includes('youtube.com/watch') || link.includes('youtu.be/')
                ? `https://img.youtube.com/vi/${link.includes('youtube.com/watch')
                    ? new URL(link).searchParams.get('v')
                    : link.split('/').pop().split('?')[0]}/0.jpg`
                : null
        }))
    };
};

export { formatContent };