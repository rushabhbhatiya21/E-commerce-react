const mongoose = require('mongoose');
const { Schema } = mongoose;

const CustomerSchema = new Schema({
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    email: {
      type: String
    }
})

exports.customer = mongoose.model('customer', CustomerSchema);