const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');   // <-- only one declaration

const app = express();
const PORT = 3000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

const BASE = 'https://www.1shows.org';

async function search1Shows(query) {
    const url = `${BASE}/search?query=${encodeURIComponent(query)}`;
    console.log('Fetching:', url);

    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Cache-Control': 'no-cache',
            'Referer': 'https://www.1shows.org/'
        }
    });

    const html = await res.text();
    console.log('Response status:', res.status);
    console.log('HTML length:', html.length);

    fs.writeFileSync('debug.html', html);
    console.log('HTML saved to debug.html');

    const $ = cheerio.load(html);
    const items = [];

    // Primary selector
    const cards = $('.film-card-animation');
    console.log('Found .film-card-animation elements:', cards.length);

    cards.each((i, el) => {
        const a = $(el).find('a#film-card').first();
        if (!a.length) return;
        const link = a.attr('href');
        const title = a.find('h3.sr-only').text().trim() || 'Unknown';
        const thumb = a.find('img').attr('src') || '';
        const ratingSpan = a.find('span.after-content');
        const rating = ratingSpan.attr('data-after-content') || 'N/A';
        const type = link.includes('/tv/') ? 'tvshow' : 'movie';
        items.push({ title, link, thumb, rating, meta: '', type });
    });

    // Fallback if nothing found
    if (items.length === 0) {
        console.log('Primary selector found nothing, trying fallback...');
        $('a[href*="/tv/"], a[href*="/movies/"]').each((i, el) => {
            const link = $(el).attr('href');
            if (!link || !link.match(/\/(tv|movies)\/\d+/)) return;
            const title = $(el).find('h3, .title, img').attr('alt') || $(el).text().trim() || 'Unknown';
            const thumb = $(el).find('img').attr('src') || '';
            const type = link.includes('/tv/') ? 'tvshow' : 'movie';
            items.push({ title: title.substring(0, 100), link, thumb, rating: '', meta: '', type });
        });
        console.log('Fallback found items:', items.length);
    }

    console.log('Total items returned:', items.length);
    return items;
}

async function getDetail(pageUrl) {
    const res = await fetch(pageUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const name = $('meta[property="og:title"]').attr('content')?.replace(' - 1Shows', '') || 'N/A';
    const description = $('meta[name="description"]').attr('content') || '';
    const poster = $('meta[property="og:image"]').attr('content') || '';
    const rating = 'N/A';
    const type = pageUrl.includes('/tv/') ? 'tvshow' : 'movie';

    let seasons = [];
    $('script').each((i, el) => {
        const text = $(el).html();
        if (!text) return;
        const seasonsMatch = text.match(/"seasons":(\[[^\]]*\])/);
        if (seasonsMatch) {
            try {
                seasons = JSON.parse(seasonsMatch[1]);
            } catch(e) {}
        }
    });

    return {
        name,
        description,
        poster,
        rating,
        type,
        seasons: seasons.map(s => ({
            season_number: s.season_number,
            episode_count: s.episode_count,
            name: s.name,
            poster: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : ''
        })),
        director: '',
        cast: ''
    };
}

async function getEmbedUrl(pageUrl) {
    return ''; // placeholder until we find the API
}

app.get('/api/search', async (req, res) => {
    const q = req.query.q || '';
    try {
        const data = await search1Shows(q);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/detail', async (req, res) => {
    const url = req.query.url;
    try {
        const info = await getDetail(url);
        res.json(info);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/embed', async (req, res) => {
    const url = req.query.url;
    try {
        const embed = await getEmbedUrl(url);
        res.json({ embed });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});