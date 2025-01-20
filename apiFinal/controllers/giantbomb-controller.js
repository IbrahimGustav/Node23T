const giantbomb = require('../config/giantbomb');
const pool = require('../config/db');
const { createGame } = require('../models/giantbomb-model');
const cache = require('../config/cache');

const fetchFromGiantbomb = async (endpoint, params = {}, cacheKey = null) => {
  if (cacheKey && cache.has(cacheKey)) {
      console.log('Fetching data from cache');
      return cache.get(cacheKey);
  }

  try {
      const response = await giantbomb.get(endpoint, { params });

      if (response.data.error !== 'OK') {
          throw new Error(`Giant Bomb API Error: ${response.data.error}`);
      }

      const result = createGame(response.data.results);

      if (cacheKey) cache.set(cacheKey, result);

      return result;
  } catch (error) {
      console.error(`Error fetching data from Giant Bomb API [${endpoint}]:`, error.message);
      throw new Error(`Failed to fetch data from ${endpoint}`);
  }
};

const searchGames = async (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    try {
      const cacheKey = `searchGames:${query}`;
      const games = await fetchFromGiantbomb('/search', { query, resources: 'game', limit: 20, field_list: 'id,name,deck,description,image,platforms' }, cacheKey);
      res.json(games);
    } catch (error) {
      console.error("Giant Bomb API Error:", error);
      res.status(500).json({ message: 'Failed to fetch data from Giant Bomb API' });
    }
};

const getGameDetails = async (req, res) => {
  const gameId = req.params.id;
  if (!gameId) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  try {
    const cacheKey = `gameDetails:${gameId}`;
    const game = await fetchFromGiantbomb(`/game/${gameId}`, {}, cacheKey);
    res.json(game);
  } catch (error) {
    console.error("Giant Bomb API Error:", error);
    res.status(500).json({ message: 'Failed to fetch game details from Giant Bomb API' });
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
      const response = await fetchFromGiantbomb(`/game/${id}`, { field_list: 'id,name,deck,description,image,platforms' }, cacheKey);
      const gameData = createGame(response);

      const query = `
          INSERT INTO games (id, name, deck, description, image_url, user_id)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name = VALUES(name), deck = VALUES(deck), description = VALUES(description), image_url = VALUES(image_url);
      `;

      await pool.execute(query, [gameData.id, gameData.name, gameData.deck, gameData.description, gameData.image, userId]);

      return res.status(201).json({ message: 'Game saved successfully' });
  } catch (error) {
      console.error('Error saving game:', error.message);
      return res.status(500).json({ message: 'Failed to save game', error: error.message });
  }
};

const getUserGames = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
      const query = `
          SELECT id, name, deck, description, image_url
          FROM games
          WHERE user_id = ?;
      `;

      const [results] = await pool.execute(query, [userId]);

      return res.status(200).json({ message: 'Games retrieved successfully', games: results });
  } catch (error) {
      console.error('Error fetching user games:', error.message);
      return res.status(500).json({ message: 'Failed to fetch user games', error: error.message });
  }
};

const deleteGame = async (req, res) => {
  const { id } = req.params; // ID of the game to delete
  const userId = req.user?.id;

  if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
  }

  try {
      const query = `DELETE FROM games WHERE id = ? AND user_id = ?;`;
      const [result] = await pool.execute(query, [id, userId]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Game not found or not owned by user' });
      }

      return res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
      console.error('Error deleting game:', error.message);
      return res.status(500).json({ message: 'Failed to delete game', error: error.message });
  }
};

module.exports = { searchGames, getGameDetails, saveGame, getUserGames, deleteGame };
