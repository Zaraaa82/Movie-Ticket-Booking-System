const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const categories = [
    'Popcorn',
    'Drinks',
    'Candy',
    'Combo',
    'Other'
];

const snackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLegth: 1,
        maxLength: 100,
    },
    category: {
        type: String,
        enum: categories,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }

},{timestamps: true})


const Snack = mongoose.model("Snack", snackSchema)


module.exports = Snack