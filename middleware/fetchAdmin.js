const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwtSecret';
const fetchAdmin = (req, res, next) => {
    //get user from the jwtToken and append id to request object
    const token = req.header('adminAuth-token');
    if (!token) {
        res.status(401).send({ error: 'Plese authenticate using a valid token' })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        //console.log(data);
        req.admin = data.admin;
        next()

    } catch (error) {
        res.status(401).send({ error: 'Plese authenticate using a valid token' })
    }
}

module.exports = fetchAdmin;