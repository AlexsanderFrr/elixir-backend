require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("Auth Header:", authHeader); 
    console.log("Token:", token); 

    if (token == null) {
        console.log("Token ausente"); 
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log("Erro na verificação do token:", err); 
            return res.sendStatus(403);
        }
        console.log("User:", user); 
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
