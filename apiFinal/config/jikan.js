require('dotenv').config()
const axios = require('axios')
const jikan = axios.create({
    baseURL:'https://api.jikan.moe/v4',
    headers:{
    Accept: 'application/json',
  }
})

module.exports = jikan
