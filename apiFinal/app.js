const express = require('express')
const cors = require('cors')
const router = require('./routes/router')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

const port = process.env.PORT

app.listen(port,()=>{
    console.log('Server at http://localhost:${port}/api/');
})