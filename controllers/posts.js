const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const mapBoxToken = process.env.MAPBOX_TOKEN;
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'porawiec',
    api_key: '671774781274648',
    api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = {
    // Posts Index
    async postIndex(req, res, next) {
        let posts = await Post.paginate({},{
            page: req.query.page || 1,
            limit: 10
        });
        posts.page = Number(posts.page);
        res.render('posts/index', { posts, mapBoxToken, title: 'Posts Index' });
    },

    // Posts New
    postNew(req, res, next) {
        res.render('posts/new');
    },

    // Posts Create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for(const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }
        let response = await geocodingClient
        .forwardGeocode({
            // passing in location from form to turn into geocoordinates
            query: req.body.post.location,
            limit: 1
        })
        .send()
        req.body.post.coordinates = response.body.features[0].geometry.coordinates;
        // use req.body to create a new Post
        let post = await Post.create(req.body.post);
        req.session.success = 'Post created successfully!';
        res.redirect(`/posts/${post.id}`)
    },

    // Posts Show
    async postShow(req, res, next) {
       let post = await Post.findById(req.params.id).populate({
           path: 'reviews',
           options: { sort: { '_id': -1 }},
           populate: {
               path: 'author',
               model: 'User'
           }
        });
        const floorRating = post.calculateAvgRating();
        res.render('posts/show', { post, floorRating });
    },

    // Posts Edit
    async postEdit(req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', { post });
     },

    // Posts Update
    async postUpdate(req, res, next) {
        // find post by id
        let post = await Post.findById(req.params.id);
        // check if there are any images queued for deletion
        if(req.body.deleteImages && req.body.deleteImages.length) {
            let deleteImages = req.body.deleteImages;
            // loop over deleteImages and delete images from cloudinary and post.images
            for(const public_id of deleteImages) {
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                // delete images from cloudinary
                for (const image of post.images) {
                    if(image.public_id === public_id) {
                        let index = post.images.indexOf(image);
                        post.images.splice(index,1);
                    }
                }
            }
        }
        // check if new images are queued for upload
        if(req.files){
            // upload images
            for(const file of req.files) {
                let image = await cloudinary.v2.uploader.upload(file.path);
                // add images to post.images array
                post.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                });
            }
        }
        // check if location is updated
        if(req.body.post.location !== post.location) {
            let response = await geocodingClient
            .forwardGeocode({
                // passing in location from form to turn into geocoordinates
                query: req.body.post.location,
                limit: 1
            })
            .send()
            post.coordinates = response.body.features[0].geometry.coordinates;
            post.location = req.body.post.location;
        }

        // update post with properties submitted from the edit form
        // note: this will also update equal values
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;

        post.save();
        res.redirect(`/posts/${post.id}`) // could also work with req.params.id
     },
    // Posts Destroy
    async postDestroy(req, res, next) {
        let post = await Post.findById(req.params.id);
        for (const image of post.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        req.session.success = 'Post deleted successfully!';
        res.redirect('/posts');
     }
}