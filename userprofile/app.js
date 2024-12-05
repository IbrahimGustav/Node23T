const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const userRouter = require ('./routes/user-routes')

dotenv.config()
const app = express()

app.use(bodyParser.json())
app.use('/api/users', userRouter)

const port = process.env.PORT
app.listen(port, ()=>{
    console.log('Server run at http://localhost:${PORT}');
    
})