const cache = require('../config/cache');
const jikan = require('../config/jikan');
const pool = require('../config/db');
const { 
    createAnime, 
    createManga, 
    createSeasonsNow, 
    saveAnimeToDatabase, 
    saveMangaToDatabase 
} = require('../models/jikan-model');
const bcrypt = require('bcrypt');

const fetchFromJikan = async (endpoint, params = {}, createFunc, cacheKey = null) => {
    if (cacheKey && cache.has(cacheKey)) {
        console.log('Fetching data from server cache');
        return cache.get(cacheKey);
    }

    try {
        const response = await jikan.get(endpoint, { params });

        const result = Array.isArray(response.data.data)
            ? response.data.data.map(item => createFunc(item)).filter(Boolean)
            : createFunc(response.data.data);

        if (cacheKey) cache.set(cacheKey, result);

        return result;
    } catch (error) {
        console.error(`Error fetching data from Jikan API [${endpoint}]:`, error.message);
        throw new Error(`Failed to fetch data from ${endpoint}`);
    }
};

const handleError = (res, error) => {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
};

const searchAnime = async (req, res) => {
    const query = req.query.q;
    try {
        const animeResult = await fetchFromJikan('/anime', { q: query, limit: 5 }, createAnime, query);
        res.status(200).json(animeResult);
    } catch (error) {
        handleError(res, error);
    }
};

const searchAnimeById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Anime ID is required' });

    try {
        const animeData = await fetchFromJikan(`/anime/${id}`, {}, createAnime);
        if (!animeData) return res.status(404).json({ message: 'Anime not found' });

        res.status(200).json(animeData);
    } catch (error) {
        handleError(res, error);
    }
};

const randomAnime = async (req, res) => {
    try {
        const response = await jikan.get('/random/anime');
        const anime = createAnime(response.data.data);
        res.status(200).json(anime);
    } catch (error) {
        handleError(res, error);
    }
};

const randomManga = async (req, res) => {
    try {
        const response = await jikan.get('/random/manga');
        const manga = createManga(response.data.data);
        res.status(200).json(manga);
    } catch (error) {
        handleError(res, error);
    }
};

const searchAnimeRanking = async (req, res) => {
    try {
        const animeRankingResult = await fetchFromJikan('/anime', { order_by: 'score', sort: 'desc', limit: 50 }, createAnime);
        res.status(200).json(animeRankingResult);
    } catch (error) {
        handleError(res, error);
    }
};

const searchManga = async (req, res) => {
    const query = req.query.q;
    try {
        const mangaResult = await fetchFromJikan('/manga', { q: query, limit: 5 }, createManga, query);
        res.status(200).json(mangaResult);
    } catch (error) {
        handleError(res, error);
    }
};

const searchSeasonsNow = async (req, res) => {
    try {
        const seasonsNowResult = await fetchFromJikan('/seasons/now', {}, createSeasonsNow);
        res.status(200).json(seasonsNowResult);
    } catch (error) {
        handleError(res, error);
    }
};

const saveAnime = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing user ID' });

    try {
        const animeData = await fetchFromJikan(`/anime/${id}`, {}, createAnime);
        if (!animeData || !animeData.mal_id) return res.status(400).json({ message: 'Invalid anime data or MAL ID not found' });

        await saveAnimeToDatabase(animeData, userId);
        res.status(200).json({ message: 'Anime saved successfully', anime: animeData });
    } catch (error) {
        handleError(res, error);
    }
};

const saveManga = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing user ID' });

    try {
        const mangaData = await fetchFromJikan(`/manga/${id}`, {}, createManga);
        if (!mangaData || !mangaData.mal_id) return res.status(400).json({ message: 'Invalid manga data or MAL ID not found' });

        await saveMangaToDatabase(mangaData, userId);
        res.status(200).json({ message: 'Manga saved successfully', manga: mangaData });
    } catch (error) {
        handleError(res, error);
    }
};

const getUserAnime = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing user ID' });

    try {
        const query = 'SELECT mal_id, title, synopsis FROM anime WHERE user_id = ?;';
        const [results] = await pool.execute(query, [userId]);
        res.status(200).json({ message: 'Anime retrieved successfully', anime: results });
    } catch (error) {
        handleError(res, error);
    }
};

const getUserManga = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing user ID' });

    try {
        const query = 'SELECT mal_id, title, synopsis FROM manga WHERE user_id = ?;';
        const [results] = await pool.execute(query, [userId]);
        res.status(200).json({ message: 'Manga retrieved successfully', manga: results });
    } catch (error) {
        handleError(res, error);
    }
};

const deleteAnime = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing user ID' });

    try {
        const query = 'DELETE FROM anime WHERE mal_id = ? AND user_id = ?;';
        const [result] = await pool.execute(query, [id, userId]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Anime not found or not owned by user' });

        res.status(200).json({ message: 'Anime deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

const deleteManga = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized: Missing user ID' });

    try {
        const query = 'DELETE FROM manga WHERE mal_id = ? AND user_id = ?;';
        const [result] = await pool.execute(query, [id, userId]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Manga not found or not owned by user' });

        res.status(200).json({ message: 'Manga deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

const getTopAnime = async (req, res) => {
    try {
        const response = await jikan.get('/top/anime', { params: { order_by: 'score' } });
        const topAnime = response.data.data.map(createAnime);
        res.status(200).json(topAnime);
    } catch (error) {
        handleError(res, error);
    }
};

const getTopManga = async (req, res) => {
    try {
        const response = await jikan.get('/top/manga', { params: { order_by: 'score' } });
        const topManga = response.data.data.map(createManga);
        res.status(200).json(topManga);
    } catch (error) {
        handleError(res, error);
    }
};

const getTopAnimeCurrentSeason = async (req, res) => {
    try {
        const response = await jikan.get('/seasons/now', { params: { order_by: 'score' } });
        const topCurrentSeason = response.data.data.map(createAnime);
        res.status(200).json(topCurrentSeason);
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { 
    searchAnime, 
    searchAnimeById, 
    searchManga, 
    searchSeasonsNow, 
    searchAnimeRanking, 
    saveAnime, 
    saveManga, 
    getUserAnime, 
    getUserManga, 
    deleteAnime, 
    deleteManga, 
    randomAnime, 
    randomManga, 
    getTopAnime, 
    getTopAnimeCurrentSeason, 
    getTopManga 
};
