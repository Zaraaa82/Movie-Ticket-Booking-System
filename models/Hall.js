const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
   name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        unique: true
    },
    type: {
        type: String,
        enum: ["Standard", "VIP", "IMAX"],
        default: "Standard"
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1
    }

},{timestamps: true})


const Hall = mongoose.model("Hall", hallSchema)


module.exports = Hall