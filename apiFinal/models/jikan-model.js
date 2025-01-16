const poolPromise = require('../config/db');

const createAnime = (anime) => ({
    mal_id: anime.mal_id || null, // Default to null if no MAL ID is provided
    title: anime.title || 'N/A',
    synopsis: anime.synopsis || 'No synopsis available.',
    image_url: anime.images?.jpg?.image_url || null,
    score: anime.score || 0,
    episodes: anime.episodes || 'Unknown',
    studios: anime.studios?.map(studio => studio.name) || [],
    type: anime.type || 'Unknown',
    url: anime.url || '#',
});

const createManga = (manga) => ({
    mal_id: manga.mal_id || null,
    title: manga.title || 'N/A',
    synopsis: manga.synopsis || 'No synopsis available.',
    image_url: manga.images?.jpg?.image_url || null,
    score: manga.score || 0,
    url: manga.url || '#',
    chapters: manga.chapters || 'Unknown',
    volumes: manga.volumes || 'Unknown',
    type: manga.type || 'Unknown',
});

const createSeasonsNow = (anime) => ({
    title: anime.title || 'N/A',
    image_url: anime.images?.jpg?.image_url || null,
    episodes: anime.episodes || 'Unknown',
    type: anime.type || 'Unknown',
    url: anime.url || '#',
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

    await poolPromise.execute(query, values);
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

    await poolPromise.execute(query, values);
};

module.exports = { createAnime, createManga, createSeasonsNow, saveAnimeToDatabase, saveMangaToDatabase };