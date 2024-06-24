const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    username: {
      type: String,
      required: true,
    },
    orderlist: [{
        id: {
            type: Number,
            required: true
        },
        quantity:{
            type: Number,
            required: true,
            min:[1, "not a vaid input"]
        },
        title:{
            type: String,
            required:true
        },
        price:{
            type: Number,
            required: true
        },
    }],
    cartvalue:{
        type: Number,
        require:true
    },
    date:Date,
    email:String
})

exports.orders = mongoose.model('orders', OrderSchema);