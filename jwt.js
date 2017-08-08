//Json web Token
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'dfs87dfsd5fsd4f3sdf2s';

function getToken(obj) {
    return new Promise((resolve, reject) => {
        jwt.sign(obj, SECRET_KEY, { expiresIn: 10 }, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
}

function getObjFromToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, obj) => {
            if (err) return reject(err);
            resolve(obj);
        });
    });
}

module.exports = { getToken, getObjFromToken };
//getToken({email: 'thien@gmail.com'}).then((token) => console.log(token)).catch((err) => console.log(err.toString()));
// getObjFromToken('j%3A%7B%7D')
// .then((obj) => console.log(obj)).catch((err) => console.log(err.toString()));
