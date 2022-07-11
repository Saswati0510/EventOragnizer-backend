const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwtSecret';
const fetchuser = (req, res, next) => {
    //get user from the jwtToken and append id to request object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: 'Plese authenticate using a valid token' })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        /* console.log(data); */
        req.user = data.user;
        next()

    } catch (error) {
        res.status(401).send({ error: 'Plese authenticate using a valid token' })
    }
}

module.exports = fetchuser;