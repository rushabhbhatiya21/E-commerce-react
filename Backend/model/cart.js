const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
    username: {
      type: String,
      required: true,
    },
    title:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true,
        min:[1, "not a vaid input"]
    },
    thumbnail: String
})

exports.cart = mongoose.model('cart', CartSchema);