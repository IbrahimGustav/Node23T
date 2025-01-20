const poolPromise = require('../config/db');

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
