const pool = require('../config/db');

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
  

const createAnime = (anime) => ({
    mal_id: anime.mal_id,
    title: anime.title,
    synopsis: anime.synopsis,
    image_url: anime.images?.jpg?.image_url,
    score: anime.score,
    episodes: anime.episodes,
    studios: anime.studios?.map(studio => studio.name),
    type: anime.type,
    url: anime.url,
});

const createManga = (manga) => ({
    mal_id: manga.mal_id,
    title: manga.title,
    synopsis: manga.synopsis,
    image_url: manga.images?.jpg?.image_url,
    score: manga.score,
    url: manga.url,
    chapters: manga.chapters,
    volumes: manga.volumes,
    type: manga.type,
});

const createSeasonsNow = (anime) => ({
    title: anime.title,
    image_url: anime.images?.jpg?.image_url,
    episodes: anime.episodes,
    type: anime.type,
    url: anime.url,
});

const saveAnimeToDatabase = async (anime, userId) => {
    const { mal_id, title, synopsis } = anime;

    const query = `
        INSERT INTO anime (mal_id, title, synopsis, user_id)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            title = VALUES(title), 
            synopsis = VALUES(synopsis);
    `;

    const values = [mal_id, title, synopsis, userId];

    await pool.execute(query, values);
};

const saveMangaToDatabase = async (manga, userId) => {
    const { mal_id, title, synopsis } = manga;

    const query = `
        INSERT INTO manga (mal_id, title, synopsis, user_id)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            title = VALUES(title), 
            synopsis = VALUES(synopsis);
    `;

    const values = [mal_id, title, synopsis, userId];

    await pool.execute(query, values);
};

const getUserAnime = async (userId) => {
    const query = 'SELECT mal_id, title, synopsis FROM anime WHERE user_id = ?;';
    const [results] = await pool.execute(query, [userId]);
    return results;
};

const getUserManga = async (userId) => {
    const query = 'SELECT mal_id, title, synopsis FROM manga WHERE user_id = ?;';
    const [results] = await pool.execute(query, [userId]);
    return results;
};

const deleteAnime = async (mal_id, userId) => {
    const query = 'DELETE FROM anime WHERE mal_id = ? AND user_id = ?;';
    const [result] = await pool.execute(query, [mal_id, userId]);
    return result.affectedRows > 0;
};

const deleteManga = async (mal_id, userId) => {
    const query = 'DELETE FROM manga WHERE mal_id = ? AND user_id = ?;';
    const [result] = await pool.execute(query, [mal_id, userId]);
    return result.affectedRows > 0;
};

const getUserAnimeById = async (userId, mal_id) => {
    const query = 'SELECT mal_id, title, synopsis FROM anime WHERE user_id = ? AND mal_id = ?;';
    const [results] = await pool.execute(query, [userId, mal_id]);
    return results.length > 0 ? results[0] : null;
};

const getUserMangaById = async (userId, mal_id) => {
    const query = 'SELECT mal_id, title, synopsis FROM manga WHERE user_id = ? AND mal_id = ?;';
    const [results] = await pool.execute(query, [userId, mal_id]);
    return results.length > 0 ? results[0] : null;
};

module.exports = { 
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
};