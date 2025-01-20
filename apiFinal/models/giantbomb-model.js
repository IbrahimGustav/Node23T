const createGame = (gameData) => ({
  id: gameData.id,
  name: gameData.name,
  deck: gameData.deck,
  description: gameData.description,
  image: gameData.image?.original_url,
  platforms: gameData.platforms?.map(platform => platform.name) || [],
});

module.exports = { createGame };