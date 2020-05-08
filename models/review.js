const mongoose = req('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
    body: String,
    // author references objectId of a user
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Review', ReviewSchema)