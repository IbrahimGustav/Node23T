const { log } = require('console');
let http = require('http') //node module for http
let port = 2000;

let server = http.createServer((req, res)=>{
    let url = req.url
    console.log(url);
    res.writeHead(200, {
        'content-type':'application/json'
    })
    if(url=='/student'){
        res.write("student page")
    }
    else if(url=='/lecturer'){
        res.write("lecturer page")
    }
    else if(url=='/')
    res.write("Welcome to my REST API")

    else{
        res.write("Wrong API endpoint")
    }
    res.end()
})

server.listen(port, ()=>{
    console.log(`Server run at http://localhost:${port}`);
})