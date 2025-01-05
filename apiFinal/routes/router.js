const express = require('express')
const router = express()
const jikanController = require('../controllers/jikan-controller')

router.get('/search/anime',jikanController.searchAnime)
router.get('/search/manga',jikanController.searchManga)
router.get('/search/seasons/now', jikanController.searchSeasonsNow)

module.exports = router