const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const mapBoxToken = process.env.MAPBOX_TOKEN;

module.exports = {
    // GET /
    async landingPage(req, res, next) {
        const posts = await Post.find({});
        res.render('index', { posts, mapBoxToken, title: 'Surf Shop - Home' });
    },

    // GET /register
    getRegister(req, res, next) {
        res.render('register', { title: 'Register' });
    },

    // POST /register
    async postRegister(req, res, next) {
        console.log('registering user');

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });

        let user = await User.register(newUser, req.body.password);
        req.login(user, function(err) {
            if (err) {
                return next(err)
            };
            req.session.success = `Welcome to Surf Shop, ${user.username}!`;
            res.redirect('/');
        });
    },

    // GET /login
    getLogin(req, res, next) {
        res.render('login', { title: 'Login' });
    },

    // POST /login
    async postLogin(req, res, next) {
        const { username, password } = req.body;
        const { user, error } = await User.authenticate()(username, password);
        if (!user && error) return next(error);
        req.login(user, function(err) {
            if (err) return next(err);
            req.session.success = `Welcome back, ${username}!`;
            const redirectUrl = req.session.redirectTo || '/';
            delete req.session.redirectTo;
            res.redirectTo(redirectUrl);
        });
    },

    // GET /logout
    getLogout(req, res, next) {
            req.logout();
            res.redirect('/');
    }
}