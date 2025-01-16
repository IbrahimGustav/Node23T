const giantbomb = require('../config/giantbomb');
const { createGame } = require('../models/giantbomb-model');

const searchGames = async (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    try {
      const response = await giantbomb.get('/search', {
        params: {
          query: query,
          resources: 'game', // Limit search to games
          limit: 20, // Adjust as needed
          field_list: 'id,name,deck,description,image,platforms' // Request only needed fields
        },
      });

      if (response.data.error !== 'OK') {
        return res.status(500).json({ message: `Giant Bomb API Error: ${response.data.error}` });
      }
      const games = response.data.results.map(createGame);
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
    const response = await giantbomb.get(`/game/${gameId}`, {
      params: {
        field_list: 'id,name,deck,description,image,platforms,developers,publishers,genres,original_release_date' // Example full list
      },
    });

    if (response.data.error !== 'OK') {
      return res.status(500).json({ message: `Giant Bomb API Error: ${response.data.error}` });
    }
    const game = createGame(response.data.results);
    res.json(game);
  } catch (error) {
    console.error("Giant Bomb API Error:", error);
    res.status(500).json({ message: 'Failed to fetch game details from Giant Bomb API' });
  }
};


module.exports = { searchGames, getGameDetails };