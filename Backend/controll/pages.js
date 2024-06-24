
const itemsModel = require('../model/items');
const items = itemsModel.items;
const cartModel = require('../model/cart');
const cart = cartModel.cart;
const customerModel = require('../model/customer');
const customer = customerModel.customer;
const orderModel = require('../model/order');
const order = orderModel.orders;
require('dotenv').config();


//single order for generating pdf
exports.order = async (req, res)=>{
    const order = await order.findOne({_id:{$eq:req.params.id}})
    res.send(order)
}

exports.items = async (req, res)=>{
    const item_list = await items.find();
    const username = req.cookies.user
    const user = await customer.findOne({username})
    res.status(200).json({items: item_list, username: user})
}

exports.cart = async (req, res)=>{
    const username = req.cookies.user
    const user = await customer.findOne({username})
    const cart_list = await cart.find({username});
    res.send({cart:cart_list,user: user})
}

exports.orders = async (req, res)=>{
    const username = req.cookies.user
    const order_list = await order.find({username});
    const user = await customer.findOne({username})
    res.send({orders: order_list, user: user})
}
