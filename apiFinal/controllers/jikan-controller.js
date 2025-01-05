const cache = require('../config/cache');
const jikan = require('../config/jikan');
const { createAnime, createManga } = require('../models/jikan-model');

const searchAnime = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    if (cache.has(query)) {
        console.log('Fetching data from server cache');
        return res.status(200).json(cache.get(query));
    }

    try {
        const response = await jikan.get('/anime', {
            params: { q: query, limit: 5 },
        });

        const animeResult = response.data.data.map(anime => {
            try {
                return createAnime(anime);
            } catch (error) {
                console.error('Error formatting anime data:', error.message);
                return null;
            }
        }).filter(Boolean);

        cache.set(query, animeResult);

        return res.status(200).json(animeResult);
    } catch (error) {
        console.error('Error fetching data from Jikan API:', error.message);
        return res.status(500).json({ message: 'Failed to fetch anime data' });
    }
};

const searchManga = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    if (cache.has(query)) {
        console.log('Fetching data from server cache');
        return res.status(200).json(cache.get(query));
    }

    try {
        const response = await jikan.get('/manga', {
            params: { q: query, limit: 5 },
        });

        const mangaResult = response.data.data.map(manga => {
            try {
                return createManga(manga);
            } catch (error) {
                console.error('Error formatting manga data:', error.message);
                return null;
            }
        }).filter(Boolean);

        cache.set(query, mangaResult);

        return res.status(200).json(mangaResult);
    } catch (error) {
        console.error('Error fetching data from Jikan API:', error.message);
        return res.status(500).json({ message: 'Failed to fetch manga data' });
    }
};

module.exports = { searchAnime, searchManga };