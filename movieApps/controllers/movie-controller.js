const cache = require('../config/cache')
const tmdb = require('../config/tmdb')
const createMovie = require('../models/movie-model')

const searchMovie = async (req,res)=>{
    const query = req.query.query
    if(!query){
        return res.status(500).json({message:'Query Params is required'})
    }
    if(cache.has(query)){
        console.log('fetch data from server cache');
        return res.status(200).json(cache.get(query))
    }

    try {
        const response = await tmdb.get('/search/movie',{
            params : {query}
        })

        const movieResult = response.data.results.map(createMovie)
        cache.set(query,movieResult)
        return res.status(200).json(movieResult)
    } catch (error) {
        console.log(error);
        
    }
}

const searchPopularMovie = async (req, res) => {
    try {
        const response = await tmdb.get('/discover/movie', {
            params: { sort_by: 'popularity.desc' }
        });

        const movieResult = response.data.results.map(createMovie)
        cache.set('popular_movies', movieResult)
        return res.status(200).json(movieResult)
    } catch (error) {
        console.error('Error fetching popular movies:', error)
        return res.status(500).json({ message: 'Error fetching popular movies' })
    }   
}

module.exports = {searchMovie, searchPopularMovie}