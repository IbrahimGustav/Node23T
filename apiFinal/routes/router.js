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
router.get('/user/anime', userAuth, jikanController.getUserAnime);
router.delete('/anime/:id', userAuth, jikanController.deleteAnime);
router.get('/random/anime', jikanController.randomAnime);
router.get('/search/anime', jikanController.searchAnime);
router.get('/search/anime/:id', jikanController.searchAnimeById);
router.get('/top/anime', jikanController.getTopAnime);

// Manga Routes
router.post('/save/manga/:id', userAuth, jikanController.saveManga);
router.get('/user/manga', userAuth, jikanController.getUserManga);
router.delete('/manga/:id', userAuth, jikanController.deleteManga);
router.get('/random/manga', jikanController.randomManga);
router.get('/search/manga', jikanController.searchManga);
router.get('/top/manga', jikanController.getTopManga);

// Season Routes
router.get('/search/seasons/now', jikanController.searchSeasonsNow);
router.get('/top/season', jikanController.getTopAnimeCurrentSeason);

// Game Routes
router.post('/save/game/:id', userAuth, giantbombController.saveGame);
router.get('/user/game', userAuth, giantbombController.getUserGames);
router.delete('/game/:id', userAuth, giantbombController.deleteGame);
router.get('/search/game', giantbombController.searchGames);
router.get('/search/game/:id', giantbombController.getGameDetails);

module.exports = router;
