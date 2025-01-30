const createGame = (gameData) => ({
  id: gameData.id || null,
  name: gameData.name || 'Unknown Name',
  deck: gameData.deck || 'No summary available',
  description: gameData.description || 'No description available',
  image: gameData.image?.original_url || 'No image available',
  platforms: Array.isArray(gameData.platforms) 
    ? gameData.platforms.map(platform => platform.name) 
    : [],
});

module.exports = { createGame };
