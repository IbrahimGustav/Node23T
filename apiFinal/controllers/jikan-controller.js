const jikanModel = require('../models/jikan-model');
const jikan = require('../config/jikan');

const handleError = (res, error, defaultMessage = 'An error occurred') => {
  console.error(error.message);
  res.status(500).json({ message: defaultMessage, error: error.message });
};

const validateUser = (req) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new Error('Unauthorized: Missing user ID');
  }
  return userId;
};

const searchAnime = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  try {
    const animeResult = await jikanModel.fetchFromJikan('/anime', { q: query, limit: 5 }, jikanModel.createAnime, query);
    res.status(200).json(animeResult);
  } catch (error) {
    handleError(res, error, 'Failed to fetch anime data');
  }
};

const searchAnimeById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Anime ID is required' });
  }

  try {
    const animeData = await jikanModel.fetchFromJikan(`/anime/${id}`, {}, jikanModel.createAnime);
    if (!animeData) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    res.status(200).json(animeData);
  } catch (error) {
    handleError(res, error, 'Failed to fetch anime details');
  }
};

const searchMangaById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Manga ID is required' });
  }

  try {
    const mangaData = await jikanModel.fetchFromJikan(`/manga/${id}`, {}, jikanModel.createManga);
    if (!mangaData) {
      return res.status(404).json({ message: 'Manga not found' });
    }

    res.status(200).json(mangaData);
  } catch (error) {
    handleError(res, error, 'Failed to fetch manga details');
  }
};

const randomAnime = async (req, res) => {
  try {
    const response = await jikan.get('/random/anime');
    const anime = jikanModel.createAnime(response.data.data);
    res.status(200).json(anime);
  } catch (error) {
    handleError(res, error, 'Failed to fetch random anime');
  }
};

const randomManga = async (req, res) => {
  try {
    const response = await jikan.get('/random/manga');
    const manga = jikanModel.createManga(response.data.data);
    res.status(200).json(manga);
  } catch (error) {
    handleError(res, error, 'Failed to fetch random manga');
  }
};

const searchAnimeRanking = async (req, res) => {
  try {
    const animeRankingResult = await jikanModel.fetchFromJikan('/anime', { order_by: 'score', sort: 'desc', limit: 50 }, jikanModel.createAnime);
    res.status(200).json(animeRankingResult);
  } catch (error) {
    handleError(res, error, 'Failed to fetch anime ranking');
  }
};

const searchManga = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  try {
    const mangaResult = await jikanModel.fetchFromJikan('/manga', { q: query, limit: 5 }, jikanModel.createManga, query);
    res.status(200).json(mangaResult);
  } catch (error) {
    handleError(res, error, 'Failed to fetch manga data');
  }
};

const searchSeasonsNow = async (req, res) => {
  try {
    const seasonsNowResult = await jikanModel.fetchFromJikan('/seasons/now', {}, jikanModel.createSeasonsNow);
    res.status(200).json(seasonsNowResult);
  } catch (error) {
    handleError(res, error, 'Failed to fetch current season anime');
  }
};

const saveAnime = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = validateUser(req);
    const animeData = await jikanModel.fetchFromJikan(`/anime/${id}`, {}, jikanModel.createAnime);
    if (!animeData || !animeData.mal_id) {
      return res.status(400).json({ message: 'Invalid anime data or MAL ID not found' });
    }

    await jikanModel.saveAnimeToDatabase(animeData, userId);
    res.status(200).json({ message: 'Anime saved successfully', anime: animeData });
  } catch (error) {
    handleError(res, error, 'Failed to save anime');
  }
};

const saveManga = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = validateUser(req);
    const mangaData = await jikanModel.fetchFromJikan(`/manga/${id}`, {}, jikanModel.createManga);
    if (!mangaData || !mangaData.mal_id) {
      return res.status(400).json({ message: 'Invalid manga data or MAL ID not found' });
    }

    await jikanModel.saveMangaToDatabase(mangaData, userId);
    res.status(200).json({ message: 'Manga saved successfully', manga: mangaData });
  } catch (error) {
    handleError(res, error, 'Failed to save manga');
  }
};

const getUserAnime = async (req, res) => {
  try {
    const userId = validateUser(req);
    const results = await jikanModel.getUserAnime(userId);
    res.status(200).json({ message: 'Anime retrieved successfully', anime: results });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user anime');
  }
};

const getUserManga = async (req, res) => {
  try {
    const userId = validateUser(req);
    const results = await jikanModel.getUserManga(userId);
    res.status(200).json({ message: 'Manga retrieved successfully', manga: results });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user manga');
  }
};

const deleteAnime = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = validateUser(req);
    const isDeleted = await jikanModel.deleteAnime(id, userId);
    if (!isDeleted) {
      return res.status(404).json({ message: 'Anime not found or not owned by user' });
    }

    res.status(200).json({ message: 'Anime deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete anime');
  }
};

const deleteManga = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = validateUser(req);
    const isDeleted = await jikanModel.deleteManga(id, userId);
    if (!isDeleted) {
      return res.status(404).json({ message: 'Manga not found or not owned by user' });
    }

    res.status(200).json({ message: 'Manga deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete manga');
  }
};

const getTopAnime = async (req, res) => {
  try {
    const response = await jikan.get('/top/anime', { params: { order_by: 'score' } });
    const topAnime = response.data.data.map(jikanModel.createAnime);
    res.status(200).json(topAnime);
  } catch (error) {
    handleError(res, error, 'Failed to fetch top anime');
  }
};

const getTopManga = async (req, res) => {
  try {
    const response = await jikan.get('/top/manga', { params: { order_by: 'score' } });
    const topManga = response.data.data.map(jikanModel.createManga);
    res.status(200).json(topManga);
  } catch (error) {
    handleError(res, error, 'Failed to fetch top manga');
  }
};

const getTopAnimeCurrentSeason = async (req, res) => {
  try {
    const response = await jikan.get('/seasons/now', { params: { order_by: 'score' } });
    const topCurrentSeason = response.data.data.map(jikanModel.createAnime);
    res.status(200).json(topCurrentSeason);
  } catch (error) {
    handleError(res, error, 'Failed to fetch top anime of the current season');
  }
};

const getUserAnimeById = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = validateUser(req);
    const anime = await jikanModel.getUserAnimeById(userId, id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found for this user' });
    }

    res.status(200).json({ message: 'Anime retrieved successfully', anime });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user anime');
  }
};

const getUserMangaById = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = validateUser(req);
    const manga = await jikanModel.getUserMangaById(userId, id);
    if (!manga) {
      return res.status(404).json({ message: 'Manga not found for this user' });
    }

    res.status(200).json({ message: 'Manga retrieved successfully', manga });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user manga');
  }
};

module.exports = {
  searchAnime,
  searchAnimeById,
  searchManga,
  searchMangaById,
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
  getTopManga,
  getUserAnimeById,
  getUserMangaById,
};