const createAnime = (anime) => {
    return {
        title: anime.title,
        synopsis: anime.synopsis,
        image_url: anime.images?.jpg?.image_url,
        score: anime.score,
        episodes: anime.episodes,
        type: anime.type,
        url: anime.url,
    };
};

const createManga = (manga) => {
    return {
        title: manga.title,
        synopsis: manga.synopsis,
        image_url: manga.images?.jpg?.image_url,
        score: manga.score,
        url: manga.url,
        chapters: manga.chapters, // Add chapters
        volumes: manga.volumes,   // Add volumes
        type: manga.type, // add type
    };
};

module.exports = { createAnime, createManga }; // Export both functions