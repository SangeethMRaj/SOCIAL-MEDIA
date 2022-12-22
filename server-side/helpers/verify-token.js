const jwt = require('jsonwebtoken')

    const verifyJWT = (req, res, next) => {
        const token = req.headers["x-access-token"];
        if (!token) {
            res.send("We need a token, please give it to us next time");
        } else {
            jwt.verify(token, "jwtSecret", (err, decoded) => {
                if (err) {
                    res.json({ auth: false, message: "you are failed to authenticate"});
                } else {
                    req.userId = decoded.id;
                    next();
                }
            });                 
        }
    };                          

module.exports = verifyJWT
