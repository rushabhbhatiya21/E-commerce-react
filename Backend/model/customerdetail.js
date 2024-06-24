const mongoose = require('mongoose');
const { Schema } = mongoose;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const DetailSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type:String,
        validate : [validateEmail, 'Please fill a valid email address']
    },
    phone:{
        type:String,
        required:true,
        validate:{validator: function(v){return v.length==10}, message:"number is not valid"}
    },
    address:String,
    paymentMethod:String
});

exports.details = mongoose.model('details', DetailSchema);