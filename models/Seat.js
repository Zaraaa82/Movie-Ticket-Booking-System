const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const pricesByType = {
    Regular: 3,
    Premium: 4,
    VIP: 6,
    Accessible: 3
};

const seatSchema = new mongoose.Schema({
    showtime: {
        type: ObjectId,
        ref: "Showtime",
        required: true
    },
    row: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 1,
        required: true,
        match: /^[A-Z]$/
    },
    number: {
        type: Number,
        required: true,
        min: 1,
        max: 15,
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
        default: function(){return pricesByType[this.type]}
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    isDeleted:{
        type: Boolean,
        default: false
    }

},{timestamps: true})

seatSchema.index({showtime:1 , row:1, number:1}, {unique: true});

const Seat = mongoose.model("Seat", seatSchema);


module.exports = Seat