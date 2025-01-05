const express = require('express')
const router = express()
const movieController = require('../controllers/movie-controller')

router.get('/movie',movieController.searchMovie)

module.exports = router