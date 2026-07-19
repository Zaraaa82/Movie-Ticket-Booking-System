const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const showtimeSchema = new mongoose.Schema({
    movie: {
        type: ObjectId,
        ref: "Movie",
        required: true
    },
    hall: {
        type: ObjectId,
        ref: "Hall",
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }

},{timestamps: true})


const Showtime = mongoose.model("Showtime", showtimeSchema)


module.exports = Showtime