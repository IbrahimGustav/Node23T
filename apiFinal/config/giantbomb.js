require('dotenv').config()
const axios = require('axios')
const giantBomb = axios.create({
    baseURL:'https://www.giantbomb.com/api/',
    headers:{
    Accept: 'application/json',
  },
  params: {
    api_key: '5a39fa267fffe728d32f25da38b77f9913e0aa82',
    format: 'json', 
  },
});

module.exports = giantBomb;