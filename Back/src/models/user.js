const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profile: {
        type: String,
        required: true,
        default: 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)