const createAnime = (anime) => ({
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

module.exports = { createAnime, createManga, createSeasonsNow };