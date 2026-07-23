const mongoose = require('mongoose');


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100,
        trim: true
    }
},{timestamps: true});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre
