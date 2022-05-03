const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

module.exports = (req,res,next) => {
    try
    {
        const token = req.headers.authorization.split(' ')[1]
        
        const decodedToken = jwt.verify(token,`${process.env.TOKEN_KEY}`)

        const userId = decodedToken.userId


        if(req.body.userId && req.body.userId !== userId)
            throw "L'identifiant de l'utilisateur est invalide !"
        else 
            next()
    }

    catch 
    {
        res.status(401).json({
            error:`L'utilisateur ${userId} n'est pas autorisé à effectué cette action`
        })
    }
}