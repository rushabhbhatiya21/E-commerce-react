const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
    id: {
      type: Number,
      unique: true,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    price:{
        type: Number,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    },
    brand:{
      type: String,
      required: true
    },
    category:{
      type: String,
      required: true
    },
    rating:{
      type: Number,
      min: [0, "can't be that bad, rating can't be negative"],
      max:[5, "ok we get it, its good but rating can't go above 5"]
    },
})

exports.items = mongoose.model('items', ItemSchema);