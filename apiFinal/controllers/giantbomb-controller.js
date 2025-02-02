const giantbomb = require('../config/giantbomb');
const cache = require('../config/cache');
const {
  createGame,
  saveGameToDatabase,
  getUserGamesFromDatabase,
  deleteGameFromDatabase,
  getUserGameByIdFromDatabase,
  fetchFromGiantbomb
} = require('../models/giantbomb-model');

const handleError = (res, error, defaultMessage = 'An error occurred') => {
  console.error(error.message);
  res.status(500).json({ message: defaultMessage, error: error.message });
};

const searchGame = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  try {
    const cacheKey = `searchGame:${query}`;
    const games = await fetchFromGiantbomb('/search', {
      query,
      resources: 'game',
      limit: 20,
      field_list: 'id,name,deck,image,platforms',
    }, cacheKey);

    res.json(games);
  } catch (error) {
    handleError(res, error, 'Failed to fetch data from Giant Bomb API');
  }
};

const searchGameByID = async (req, res) => {
  const gameId = req.params.id;
  if (!gameId) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  try {
    const cacheKey = `gameDetails:${gameId}`;
    const game = await fetchFromGiantbomb(`/game/${gameId}`, {}, cacheKey);
    res.json(game);
  } catch (error) {
    handleError(res, error, 'Failed to fetch game details from Giant Bomb API');
  }
};

const saveGame = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const cacheKey = `gameDetails:${id}`;
    const response = await fetchFromGiantbomb(`/game/${id}`, { field_list: 'id,name,deck,image,platforms' }, cacheKey);
    const gameData = createGame(response);

    await saveGameToDatabase(gameData, userId);

    res.status(201).json({ message: 'Game saved successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to save game');
  }
};

const getUserGames = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const results = await getUserGamesFromDatabase(userId);
    res.status(200).json({ message: 'Games retrieved successfully', games: results });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user games');
  }
};

const deleteGame = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
    const affectedRows = await deleteGameFromDatabase(id, userId);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Game not found or not owned by user' });
    }

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete game');
  }
};

const getUserGameById = async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  if (!id) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  try {
    const results = await getUserGameByIdFromDatabase(userId, id);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Game not found for this user' });
    }

    res.status(200).json({ message: 'Game retrieved successfully', game: results[0] });
  } catch (error) {
    handleError(res, error, 'Failed to fetch user game');
  }
};

module.exports = {
  searchGame,
  searchGameByID,
  saveGame,
  getUserGames,
  deleteGame,
  getUserGameById,
};