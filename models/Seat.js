const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const seatSchema = new mongoose.Schema({
    showtime: {
        type: ObjectId,
        ref: "Showtime",
        required: true
    },
    row: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        required: true
    },
    number: {
        type: Number,
        required: true,
        min: 1,
        max:10,
        required: true
    },
    type: {
        type: String,
        enum: ['Regular', 'Premium', 'VIP', 'Accessible'],
        default: 'Regular'
    },
    price: {
        type: Number,
        required: true,
        min: 2,
    },
    isAvailable: {
        type: Boolean,
        default: true
    }

},{timestamps: true})


const Seat = mongoose.model("Seat", seatSchema)


module.exports = Seat