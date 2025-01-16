const express = require('express')
const router = express()
const jikanController = require('../controllers/jikan-controller')
const giantbombController = require('../controllers/giantbomb-controller')
const userController = require('../controllers/user-controller')
const userAuth = require('../middlewares/user-middleware')

router.get('/user/login', userController.userLogin)
router.post('/user', userController.userRegistration)
router.get('/user/', userAuth,userController.getAlluser)

router.post('/save/anime/:id', userAuth, jikanController.saveAnime);
router.post('/save/manga/:id', userAuth, jikanController.saveManga);
router.get('/search/anime',jikanController.searchAnime)
router.get('/search/manga',jikanController.searchManga)
router.get('/search/seasons/now', jikanController.searchSeasonsNow)
router.get('/search/animeranking', jikanController.searchAnimeRanking)
router.get('/games', giantbombController.searchGames);
router.get('/games/:id', giantbombController.getGameDetails);
router.get('/user/anime', userAuth, jikanController.getUserAnime);
router.get('/user/manga', userAuth, jikanController.getUserManga);


module.exports = router