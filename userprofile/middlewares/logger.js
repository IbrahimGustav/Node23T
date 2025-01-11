const userLogger = (req,res,next) =>{
    const d = new Date().toISOString()
    console.log(`${d} ${req.method} ${req.originalUrl}`);
    next()
}

module.exports = userLogger