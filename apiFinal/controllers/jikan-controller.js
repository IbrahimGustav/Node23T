const cache = require('../config/cache');
const jikan = require('../config/jikan');
const { createAnime, createManga, createSeasonsNow } = require('../models/jikan-model');

// Utility function to handle API requests
const fetchFromJikan = async (endpoint, params, createFunc, cacheKey = null) => {
    if (cacheKey && cache.has(cacheKey)) {
        console.log('Fetching data from server cache');
        return cache.get(cacheKey);
    }

    try {
        const response = await jikan.get(endpoint, { params });
        const result = response.data.data
            .map(item => {
                try {
                    return createFunc(item);
                } catch (error) {
                    console.error(`Error formatting ${endpoint} data:`, error.message);
                    return null;
                }
            })
            .filter(Boolean);

        if (cacheKey) cache.set(cacheKey, result);

        return result;
    } catch (error) {
        console.error(`Error fetching data from Jikan API [${endpoint}]:`, error.message);
        throw new Error(`Failed to fetch data from ${endpoint}`);
    }
};

const searchAnime = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    try {
        const animeResult = await fetchFromJikan('/anime', { q: query, limit: 5 }, createAnime, query);
        return res.status(200).json(animeResult);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const searchManga = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    try {
        const mangaResult = await fetchFromJikan('/manga', { q: query, limit: 5 }, createManga, query);
        return res.status(200).json(mangaResult);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const searchSeasonsNow = async (req, res) => {
    try {
        const seasonsNowResult = await fetchFromJikan('/seasons/now', {}, createSeasonsNow);
        return res.status(200).json(seasonsNowResult);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { searchAnime, searchManga, searchSeasonsNow };
