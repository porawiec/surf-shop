const mongoose = req('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema


// passport local mongoose will put username and password by default
// uses passport local strategy which requires username and password

const UserSchema = new Schema({
    email: String,
    image: String,
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)