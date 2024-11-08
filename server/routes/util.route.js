const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const utilRouter = express.Router();

utilRouter.get('/api/link-preview', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const preview = {
            url,
            title: $('meta[property="og:title"]').attr('content') || $('title').text() || '',
            description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '',
            image: $('meta[property="og:image"]').attr('content') || '',
            favicon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '',
            siteName: $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname,
        };

        // Handle relative URLs for favicon
        if (preview.favicon && !preview.favicon.startsWith('http')) {
            const baseUrl = new URL(url);
            preview.favicon = `${baseUrl.protocol}//${baseUrl.host}${preview.favicon}`;
        }

        res.json(preview);
    } catch (error) {
        console.error('Error fetching link preview:', error);
        res.status(500).json({ error: 'Failed to fetch link preview' });
    }
});

module.exports = utilRouter;