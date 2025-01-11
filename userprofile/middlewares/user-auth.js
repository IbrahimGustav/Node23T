const validApiKey = '88888888'
const userAuth = (req,res,next)=>{
    const apiKey = req.headers['x-api-key']

    if(!apiKey){
        res.status(400).json({message:'Access Denied'})
        return
    }

    if(apiKey != validApiKey){
        res.status(400).json({message:'Invalid API Key'})
        return
    }
    next()
}

module.exports = userAuth