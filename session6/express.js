let express = require("express")
let app = express()
let port = 2000

app.use(express.json())
app.get('/',(req,res)=>{
    res.status(200)
    res.json("Student REST API v1.0")
    res.end()
})
app.listen(port,()=>{
    console.log(`Express Server at http://localhost:${port}`);
    
})