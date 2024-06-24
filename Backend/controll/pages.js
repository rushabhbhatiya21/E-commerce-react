
const items = require('../model/items');
const Items = items.items;
const cart = require('../model/cart');
const Cart = cart.cart;
const customer = require('../model/customer');
const Cus = customer.customer;
const order = require('../model/order');
const Order = order.orders;
require('dotenv').config();


//single order for generating pdf
exports.order = async (req, res)=>{
    const order = await Order.findOne({_id:{$eq:req.params.id}})
    res.send(order)
}

exports.items = async (req, res)=>{
    const item_list = await Items.find();
    const username = req.cookies.user
    const user = await Cus.findOne({username})
    res.status(200).json({items: item_list, username: user})
}

exports.cart = async (req, res)=>{
    const username = req.cookies.user
    const user = await Cus.findOne({username})
    const cart_list = await Cart.find({username});
    res.send({cart:cart_list,user: user})
}

exports.orders = async (req, res)=>{
    const username = req.cookies.user
    const order_list = await Order.find({username});
    const user = await Cus.findOne({username})
    res.send({orders: order_list, user: user})
}
