const cart = require('../model/cart');
const Cart = cart.cart;
const cd = require('../model/customerdetail');
const Cd = cd.details;
const customer = require('../model/customer');
const Cus = customer.customer;
const order = require('../model/order');
const Order = order.orders;
const moment = require('moment');
const path = require('path');
require('dotenv').config();


exports.addtocart = async (req, res) => {
  const data = req.body
  var mess = ""
  try {
    const { id, title, username, quantity, price , thumbnail} = data;
    const db = await Cart.findOne({ username, id })
    var mess
    if (!db) {
      await Cart.create({ id, title, username, quantity, price, thumbnail})
      var mess = "added to the cart"
    }
    else {
      let doc = await Cart.findOneAndUpdate({ username, id }, { quantity: db.quantity + quantity })
      doc = await Cart.findOne({ username, id })
      var mess = "updated Quantity " + doc.quantity
    }
    res.status(200).json({
      message: mess
    })
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Item not added",
      error: err.mesage
    })
  }
}

exports.puttoitem = async (req, res) => {
  const data = req.body
  try {
    const { id, username, quantity } = data;
    if(quantity>0){
      await Cart.findOneAndUpdate({ username, id }, { quantity })
    } else {
      await Cart.findOneAndDelete({ username, id })
    }
    res.send()
  } catch (err) {
    res.status(401).json({
      message: "something went wrong",
      error: err.mesage
    })
  }
}

exports.deletitem = async (req, res) => {
  const data = req.body
  try {
    const { id, username } = data;
    await Cart.findOneAndDelete({ username, id })
    res.send()
  } catch (err) {
    res.status(401).json({
      message: "something went wrong",
      error: err.mesage
    })
  }
}

exports.adddetails = async (req, res) => {
  const data = req.body
  try {
    const { username, email, phone , address, paymentMethod} = data;
    const db = await Cd.findOne({ username })
    var mess
    if (!db) {
      await Cd.create({ username, email, phone, address , paymentMethod})
      var mess = "Order Placed And Details Added"
    }
    else {
        await Cd.findOneAndUpdate({ username }, { email, phone, address, paymentMethod }, { runValidators: true })
        var mess = "Order Placed And Details Updated"
    }
    res.status(200).json({
      message: mess
    })
  } catch (err) {
    res.status(401).json({
      message: "N",
      error: err.mesage
    })
  }
}

exports.getdetails = async (req, res) => {
  const data = req.body
  try {
    const { username } = data;
    const db = await Cd.findOne({ username })
    var mess
    if (!db) {
      var mess = { email: "", phone: "" }
    }
    else {
      var mess = { email: db.email, phone: db.phone }
    }
    res.status(200).json({
      message: mess
    })
  } catch (err) {
    res.status(401).json({
      message: "something went wrong",
      error: err.mesage
    })
  }
}

exports.order = async (req, res) => {
  const username = req.cookies.user
  try {
    const cart_list = await Cart.find({ username });
    const dateObj = new Date
    const date = moment(dateObj).format('YYYY-MM-DD');
    var ol = Object.values(cart_list)
    var orderlist = ol.map(({ id, title, price, quantity }) => ({ id, title, price, quantity }))
    let cartvalue = 0
    orderlist.forEach(data => {
      cartvalue = cartvalue + (+data.price * +data.quantity)
    })
    var { email, paymentMethod } = await Cd.findOne({ username })
    const placed = await Order.create({ username, orderlist, date, cartvalue, email})
    await Cart.deleteMany({ username })
    res.json({ message: "ok", username, orderlist, date, cartvalue, email, paymentMethod, _id: placed._id})
  }
  catch (err) {
    res.status(401).json({
      message: "something went wrong here",
      error: err.mesage
    })
  }
}
