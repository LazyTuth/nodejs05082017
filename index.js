const express = require('express');
const parser = require('body-parser').urlencoded({ extended: false });
const User = require('./User');
const { getToken } = require('./jwt');
const { redirectIfLoggedIn, checkToken } = require('./middleware');
const cookieParser = require('cookie-parser');

const app = express();

// app.use(session({
//     secret:'sakdjaijsd9a8sd7a9s87d',
//     saveUninitialized: true,
//     resave: false,
//     cookie: {maxAge: 60000}
// }))
app.use(cookieParser());

app.use(express.static('publics'));
app.set('view engine', 'ejs');
app.set('views', './views');

// function redirectIfLoggedIn(req, res, next){
//     const {token} = req.cookies;
//     if(!token) return next();
//     getObjFromToken(token).then(result => res.redirect('/private')).catch(err => {
//         res.clearCookie();
//         next();
//     });
// }

// const checkToken = async (req,res,next) => {
//     const {token} = req.cookies;
//     if(!token) return res.redirect('/signin');
//     try {
//         const user = await getObjFromToken(token);
//         req.user = user;
//         const newToken = await getToken(user);
//         res.cookie('token', newToken);
//         next();
//     } catch (error) {
//         res.redirect('/signin');
//     }
// }

app.get('/', (req, res) => {
    res.render('home', { email: 'anynomous' });
});

app.get('/signup', redirectIfLoggedIn, (req, res) => {
    res.render('signup');
});
app.post('/signup', redirectIfLoggedIn, parser, (req, res) => {
    const { email, password, name, phone } = req.body;
    const user = new User(email, password, name, phone);
    user.SignUp().then(() => {
        res.send('Thanh cong');
    }).catch((err) => {
        res.send(err.toString());
    });
});

app.get('/signin', redirectIfLoggedIn, (req, res) => {
    res.render('signin');
});
app.post('/signin', redirectIfLoggedIn, parser, async (req, res) => {
    const { email, password } = req.body;

    const user = new User(email, password);
    try {
        const signInUser = await user.SignIn();
        const token = await getToken({ email: signInUser.email, name: signInUser.name });
        res.cookie('token', token).send('dang nhap thanh cong');
    } catch (error) {
        res.send(error.toString());
    }
});

app.get('/private', checkToken, (req, res) => {
    res.send(req.user);
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started !!!'));
