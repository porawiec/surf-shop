const Review = require('../models/review');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
    // handle promise/async errors
    asyncErrorHandler: (fn) =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                .catch(next);
        },
    isReviewAuthor: async (req, res, next) => {
        // find the review
        let review = await Review.findById(req.params.review_id);
        // check to see if the author of the review is current user logged in whos trying to edit
        if(review.author.equals(req.user._id)) {
            // run next method in middleware chain if ===
            return next()
        }
        // flash message and redirect to root route
        req.session.error = 'You do not have access to edit this Review.';
        return res.redirect('/');
    },
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.error = 'You need to be logged in to do that!';
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login')
    },
    isAuthor: async (req, res, next) => {
        const post = await Post, findById(req.params.id);
        if (post.author.equals(req.user._id)) {
            res.locals.post = post;
            next();
        }
        req.session.error = 'Access denied!';
        res.redirect('back');
    }
}