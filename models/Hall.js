const mongoose = require('mongoose');


const rowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLngth: 1,
        maxLength: 1,
        match: /^[A-Z]$/
    },
    numberOfSeats:{
        type: Number,
        required: true,
        min: 1,
        max: 15
    },
    type: {
        type: String,
        enum: ["Regular", "Premium", "VIP", "Accessible"],
        default: "Regular",
        required: true
    }

},{timestamps: true});

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
    rows: {
        type: [rowSchema],
        required: true,
        min: 1
    }

},{timestamps: true})


const Hall = mongoose.model("Hall", hallSchema)


module.exports = Hall