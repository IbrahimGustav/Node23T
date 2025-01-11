const express = require('express')
const router = express()
const movieController = require('../controllers/movie-controller')

router.get('/movie',movieController.searchMovie)
router.get('/movie/popular',movieController.searchPopularMovie)

module.exports = router