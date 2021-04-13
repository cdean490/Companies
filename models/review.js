const mongoose = require('mongoose');//enabling mongoose
const Schema = mongoose.Schema;

const reviewSchema = new Schema({//review object oriented model
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model('Review', reviewSchema);