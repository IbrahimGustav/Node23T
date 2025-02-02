const express = require('express');
const router = express();
const jikanController = require('../controllers/jikan-controller');
const giantbombController = require('../controllers/giantbomb-controller');
const userController = require('../controllers/user-controller');
const userAuth = require('../middlewares/user-middleware');

// User Routes
router.get('/user/login', userController.userLogin);
router.post('/user', userController.userRegistration);
router.get('/user', userAuth, userController.getAllUsers);
router.put('/user', userAuth, userController.updateUser);
router.delete('/user/:id', userAuth, userController.deleteUser);

// Anime Routes
router.post('/save/anime/:id', userAuth, jikanController.saveAnime);
router.get('/list/anime', userAuth, jikanController.getUserAnime);
router.delete('/list/anime/:id', userAuth, jikanController.deleteAnime);
router.get('/random/anime', jikanController.randomAnime);
router.get('/search/anime', jikanController.searchAnime);
router.get('/search/anime/:id', jikanController.searchAnimeById);
router.get('/top/anime', jikanController.getTopAnime);
router.get('/list/anime/:id', userAuth, jikanController.getUserAnimeById);
router.get('/search/seasons/now', jikanController.searchSeasonsNow);
router.get('/top/season', jikanController.getTopAnimeCurrentSeason);

// Manga Routes
router.post('/save/manga/:id', userAuth, jikanController.saveManga);
router.get('/list/manga', userAuth, jikanController.getUserManga);
router.delete('/list/manga/:id', userAuth, jikanController.deleteManga);
router.get('/random/manga', jikanController.randomManga);
router.get('/search/manga/:id', jikanController.searchMangaById);
router.get('/search/manga', jikanController.searchManga);
router.get('/top/manga', jikanController.getTopManga);
router.get('/list/manga/:id', userAuth,jikanController.getUserMangaById)


// Game Routes
router.post('/save/game/:id', userAuth, giantbombController.saveGame);
router.get('/list/game/', userAuth, giantbombController.getUserGames);
router.delete('/list/game/:id', userAuth, giantbombController.deleteGame);
router.get('/list/game/:id', userAuth, giantbombController.getUserGameById);
router.get('/search/game',  giantbombController.searchGame);
router.get('/search/game/:id', giantbombController.searchGameByID);

module.exports = router;
