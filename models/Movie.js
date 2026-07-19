const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const languages =[
    "English",
    "Arabic",
    "French",
    "Spanish",
    "German",
    "Italian",
    "Japanese",
    "Korean",
    "Hindi",
    "Mandarin",
    "Russian",
    "Turkish"
];
const ageRatings = [
    "G",
    "PG",
    "PG-13", 
    "R", 
    "NC-17"
];

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100,
        trim: true
    },
    description: { 
        type: String,
        minLength: 10,
        maxLength: 600,
        required: true,
        trim: true
    },
    duration:{
        type: Number,
        min: 15,
        required: true
    },
    genre: {
        type: [ObjectId],
        ref: "Genre",
        required: true
    },
    language: {
        type: String,
        enum: languages,
        required: true
    },
    ageRating: {
        type: String,
        enum: ageRatings,
        required: true
    },
    releaseDate:{
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum : ["Now Showing", "Coming Soon"],
        default: "Now Showing"
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    posterUrl:{
        type: String,
        required: true,
        trim: true
    },
    trailerUrl: {
        type: String,
        required: true, 
        trim: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }

});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
