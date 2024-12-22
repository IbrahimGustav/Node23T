const validApiKey = '12345'

const userAuth = (req,res,next)=>{
    const apiKey = req.headers['x-api-key']
    if(!apiKey){
        res.status(501).json({message:'Access Denied'})
    }
    if (apiKey != validApiKey){
        res.status(500).json({message:'Invalid Key API'})
    }

    next()
}

module.exports = userAuth