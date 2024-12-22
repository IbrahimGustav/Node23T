const express = require('express')
const router = require('./routes/user-route')
const userLogger = require('./middlewares/user-logger')

const app = express()

app.use(express.json())
app.use(userLogger)
app.use('/api/users', router)


const port = 3000
app.listen(port, ()=>{
    console.log(`Server run at http://localhost:${port}/api/users`);
    
})