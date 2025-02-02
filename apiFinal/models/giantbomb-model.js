const pool = require('../config/db');
const giantbomb = require('../config/giantbomb');
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

    const result = Array.isArray(response.data.results)
      ? response.data.results.map(createGame)
      : createGame(response.data.results);

    if (cacheKey) cache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error(`Error fetching data from Giant Bomb API [${endpoint}]:`, error.message);
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
};


const createGame = (gameData) => ({
  id: gameData.id,
  name: gameData.name,
  deck: gameData.deck,
  image: gameData.image?.original_url,
  platforms: Array.isArray(gameData.platforms) 
    ? gameData.platforms.map(platform => platform.name) 
    : [],
});

const saveGameToDatabase = async (gameData, userId) => {
    const { id, name, deck, image } = gameData;
    
    const query = `
        INSERT INTO games (id, name, deck, image_url, user_id)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            name = VALUES(name),
            deck = VALUES(deck),
            image_url = VALUES(image_url);
    `;

    await pool.execute(query, [id, name, deck, image, userId]);
};

const getUserGamesFromDatabase = async (userId) => {
    const query = `
        SELECT id, name, deck, image_url
        FROM games
        WHERE user_id = ?;
    `;
    const [results] = await pool.execute(query, [userId]);
    return results;
};

const deleteGameFromDatabase = async (id, userId) => {
    const query = `DELETE FROM games WHERE id = ? AND user_id = ?;`;
    const [result] = await pool.execute(query, [id, userId]);
    return result.affectedRows;
};

const getUserGameByIdFromDatabase = async (userId, id) => {
    const query = `SELECT id, name, deck, image_url FROM games WHERE user_id = ? AND id = ?;`;
    const [results] = await pool.execute(query, [userId, id]);
    return results;
};

module.exports = { 
    createGame, 
    saveGameToDatabase, 
    getUserGamesFromDatabase, 
    deleteGameFromDatabase, 
    getUserGameByIdFromDatabase,
    fetchFromGiantbomb
};