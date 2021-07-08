const jwt = require('jsonwebtoken');
const config = require('config');

const auth = ( req, res, next ) => {
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).send('Token bo\'lmaganligi sababli murojaat rad etildi');
    }
    try {
        const tokenDecoded = jwt.verify(token, config.get('jwtPrivateKey')); 
        req.user = tokenDecoded;
        next();  
    } catch (error) {
        return res.status(400).send('Yaroqsiz token');
    }
}



module.exports = auth;