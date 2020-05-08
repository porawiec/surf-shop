const mongoose = req('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: String,
    price: String,
    description: String,
    images: [ String ],
    location: String,
    lat: Number,
    lng: Number,
    // author references objectId of a user
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // reviews references objectId of a review model
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

module.exports = mongoose.model('Post', PostSchema)