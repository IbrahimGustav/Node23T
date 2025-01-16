const cache = require('../config/cache');
const jikan = require('../config/jikan');
const pool = require('../config/db');
const { createAnime, createManga, createSeasonsNow, saveAnimeToDatabase, saveMangaToDatabase } = require('../models/jikan-model');

const fetchFromJikan = async (endpoint, params = {}, createFunc, cacheKey = null) => {
    if (cacheKey && cache.has(cacheKey)) {
        console.log('Fetching data from server cache');
        return cache.get(cacheKey);
    }

    try {
        const response = await jikan.get(endpoint, { params });

        // Determine if the response is an array or a single object
        const result = Array.isArray(response.data.data)
            ? response.data.data
                  .map(item => {
                      try {
                          return createFunc(item);
                      } catch (error) {
                          console.error(`Error formatting ${endpoint} data:`, error.message);
                          return null;
                      }
                  })
                  .filter(Boolean)
            : createFunc(response.data.data); // Handle single object

        if (cacheKey) cache.set(cacheKey, result);

        return result;
    } catch (error) {
        console.error(`Error fetching data from Jikan API [${endpoint}]:`, error.message);
        throw new Error(`Failed to fetch data from ${endpoint}`);
    }
};

const searchAnime = async (req, res) => {
    const query = req.query.q;
    try {
        const animeResult = await fetchFromJikan('/anime', { q: query, limit: 5 }, createAnime, query);
        return res.status(200).json(animeResult);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const searchAnimeRanking = async (req, res) => {
    try {
      const animeRankingResult = await fetchFromJikan('/anime', { order_by: 'score', sort: 'desc', limit: 50 }, createAnime);
      return res.status(200).json(animeRankingResult);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
}


const searchManga = async (req, res) => {
    const query = req.query.q;
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
const saveAnime = async (req, res) => {
    const { id } = req.params; // Anime MAL ID from the URL
    const userId = req.user?.id; // Access the user ID from the authenticated request

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    try {
        // Fetch anime details from Jikan API
        const animeData = await fetchFromJikan(`/anime/${id}`, {}, createAnime);

        if (!animeData || !animeData.mal_id) {
            return res.status(400).json({ message: 'Invalid anime data or MAL ID not found' });
        }

        // Save anime to the database
        await saveAnimeToDatabase(animeData, userId);

        return res.status(200).json({ message: 'Anime saved successfully', anime: animeData });
    } catch (error) {
        console.error('Error saving anime:', error.message);
        return res.status(500).json({ message: 'Failed to save anime', error: error.message });
    }
};

const saveManga = async (req, res) => {
    const { id } = req.params; // Manga MAL ID from the URL
    const userId = req.user?.id; // Access the user ID from the authenticated request

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    try {
        // Fetch manga details from Jikan API
        const mangaData = await fetchFromJikan(`/manga/${id}`, {}, createManga);

        if (!mangaData || !mangaData.mal_id) {
            return res.status(400).json({ message: 'Invalid manga data or MAL ID not found' });
        }

        // Save manga to the database
        await saveMangaToDatabase(mangaData, userId);

        return res.status(200).json({ message: 'Manga saved successfully', manga: mangaData });
    } catch (error) {
        console.error('Error saving manga:', error.message);
        return res.status(500).json({ message: 'Failed to save manga', error: error.message });
    }
};
const getUserAnime = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    try {
        const query = `
            SELECT mal_id, title, synopsis
            FROM anime
            WHERE user_id = ?;
        `;

        const [results] = await pool.execute(query, [userId]);

        return res.status(200).json({ message: 'Anime retrieved successfully', anime: results });
    } catch (error) {
        console.error('Error fetching user anime:', error.message);
        return res.status(500).json({ message: 'Failed to fetch user anime', error: error.message });
    }
};
const getUserManga = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    try {
        const query = `
            SELECT mal_id, title, synopsis
            FROM manga
            WHERE user_id = ?;
        `;

        const [results] = await pool.execute(query, [userId]);

        return res.status(200).json({ message: 'Manga retrieved successfully', manga: results });
    } catch (error) {
        console.error('Error fetching user manga:', error.message);
        return res.status(500).json({ message: 'Failed to fetch user manga', error: error.message });
    }
};



module.exports = { searchAnime, searchManga, searchSeasonsNow, searchAnimeRanking, saveAnime, saveManga, getUserAnime, getUserManga };
