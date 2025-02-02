const cache = require('../config/cache');
const jikan = require('../config/jikan');
const {
  createAnime,
  createManga,
  createSeasonsNow,
  saveAnimeToDatabase,
  saveMangaToDatabase,
  getUserAnime,
  getUserManga,
  deleteAnime,
  deleteManga,
  getUserAnimeById,
  getUserMangaById,
  fetchFromJikan
} = require('../models/jikan-model');

const handleError = (res, error, defaultMessage = 'An error occurred') => {
  console.error(error.message);
  res.status(500).json({ message: defaultMessage, error: error.message });
};

const searchAnime = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  try {
    const animeResult = await fetchFromJikan('/anime', { q: query, limit: 5 }, createAnime, query);
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
    const animeData = await fetchFromJikan(`/anime/${id}`, {}, createAnime);
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
    const mangaData = await fetchFromJikan(`/manga/${id}`, {}, createManga);
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
    const anime = createAnime(response.data.data);
    res.status(200).json(anime);
  } catch (error) {
    handleError(res, error, 'Failed to fetch random anime');
  }
};

const randomManga = async (req, res) => {
  try {
    const response = await jikan.get('/random/manga');
    const manga = createManga(response.data.data);
    res.status(200).json(manga);
  } catch (error) {
    handleError(res, error, 'Failed to fetch random manga');
  }
};

const searchAnimeRanking = async (req, res) => {
  try {
    const animeRankingResult = await fetchFromJikan('/anime', { order_by: 'score', sort: 'desc', limit: 50 }, createAnime);
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
    const mangaResult = await fetchFromJikan('/manga', { q: query, limit: 5 }, createManga, query);
    res.status(200).json(mangaResult);
  } catch (error) {
    handleError(res, error, 'Failed to fetch manga data');
  }
};

const searchSeasonsNow = async (req, res) => {
  try {
    const seasonsNowResult = await fetchFromJikan('/seasons/now', {}, createSeasonsNow);
    res.status(200).json(seasonsNowResult);
  } catch (error) {
    handleError(res, error, 'Failed to fetch current season anime');
  }
};

const saveAnime = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const animeData = await fetchFromJikan(`/anime/${id}`, {}, createAnime);
    if (!animeData || !animeData.mal_id) {
      return res.status(400).json({ message: 'Invalid anime data or MAL ID not found' });
    }

    await saveAnimeToDatabase(animeData, userId);
    res.status(200).json({ message: 'Anime saved successfully', anime: animeData });
  } catch (error) {
    handleError(res, error, 'Failed to save anime');
  }
};

const saveManga = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const mangaData = await fetchFromJikan(`/manga/${id}`, {}, createManga);
    if (!mangaData || !mangaData.mal_id) {
      return res.status(400).json({ message: 'Invalid manga data or MAL ID not found' });
    }

    await saveMangaToDatabase(mangaData, userId);
    res.status(200).json({ message: 'Manga saved successfully', manga: mangaData });
  } catch (error) {
    handleError(res, error, 'Failed to save manga');
  }
};

const getUserAnime = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const results = await getUserAnime(userId);
    res.status(200).json({ message: 'Anime retrieved successfully', anime: results });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user anime');
  }
};

const getUserManga = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const results = await getUserManga(userId);
    res.status(200).json({ message: 'Manga retrieved successfully', manga: results });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user manga');
  }
};

const deleteAnime = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const isDeleted = await deleteAnime(id, userId);
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
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const isDeleted = await deleteManga(id, userId);
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
    const topAnime = response.data.data.map(createAnime);
    res.status(200).json(topAnime);
  } catch (error) {
    handleError(res, error, 'Failed to fetch top anime');
  }
};

const getTopManga = async (req, res) => {
  try {
    const response = await jikan.get('/top/manga', { params: { order_by: 'score' } });
    const topManga = response.data.data.map(createManga);
    res.status(200).json(topManga);
  } catch (error) {
    handleError(res, error, 'Failed to fetch top manga');
  }
};

const getTopAnimeCurrentSeason = async (req, res) => {
  try {
    const response = await jikan.get('/seasons/now', { params: { order_by: 'score' } });
    const topCurrentSeason = response.data.data.map(createAnime);
    res.status(200).json(topCurrentSeason);
  } catch (error) {
    handleError(res, error, 'Failed to fetch top anime of the current season');
  }
};

const getUserAnimeById = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  if (!id) {
    return res.status(400).json({ message: 'Anime ID is required' });
  }

  try {
    const anime = await getUserAnimeById(userId, id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found for this user' });
    }

    res.status(200).json({ message: 'Anime retrieved successfully', anime });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user anime');
  }
};

const getUserMangaById = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  if (!id) {
    return res.status(400).json({ message: 'Manga ID is required' });
  }

  try {
    const manga = await getUserMangaById(userId, id);
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