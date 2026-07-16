const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 5, 
        maxLength: 30
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1
    }

},{timestamps: true})


const Theater = mongoose.model("Theater", theaterSchema)


module.exports = Theater