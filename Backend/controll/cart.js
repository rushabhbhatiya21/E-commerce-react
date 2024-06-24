const cartModel = require('../model/cart');
const cart = cartModel.cart;
const customerDetailsModel = require('../model/customerdetail');
const customerDetails = customerDetailsModel.details;
const customerModel = require('../model/customer');
const customer = customerDetailsModel.customer;
const orderModel = require('../model/order');
const order = orderModel.orders;
const moment = require('moment');
const path = require('path');
require('dotenv').config();


exports.add_to_cart = async (req, res) => {
  const data = req.body
  var mess = ""
  try {
    const { id, title, username, quantity, price , thumbnail} = data;
    const db = await cart.findOne({ username, id })
    var mess
    if (!db) {
      await cart.create({ id, title, username, quantity, price, thumbnail})
      var mess = "added to the cart"
    }
    else {
      let doc = await cart.findOneAndUpdate({ username, id }, { quantity: db.quantity + quantity })
      doc = await cart.findOne({ username, id })
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

exports.put_to_item = async (req, res) => {
  const data = req.body
  try {
    const { id, username, quantity } = data;
    if(quantity>0){
      await cart.findOneAndUpdate({ username, id }, { quantity })
    } else {
      await cart.findOneAndDelete({ username, id })
    }
    res.send()
  } catch (err) {
    res.status(401).json({
      message: "something went wrong",
      error: err.mesage
    })
  }
}

exports.delete_item = async (req, res) => {
  const data = req.body
  try {
    const { id, username } = data;
    await cart.findOneAndDelete({ username, id })
    res.send()
  } catch (err) {
    res.status(401).json({
      message: "something went wrong",
      error: err.mesage
    })
  }
}

exports.add_details = async (req, res) => {
  const data = req.body
  try {
    const { username, email, phone , address, paymentMethod} = data;
    const db = await customerDetails.findOne({ username })
    var mess
    if (!db) {
      await customerDetails.create({ username, email, phone, address , paymentMethod})
      var mess = "Order Placed And Details Added"
    }
    else {
        await customerDetails.findOneAndUpdate({ username }, { email, phone, address, paymentMethod }, { runValidators: true })
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

exports.get_details = async (req, res) => {
  const data = req.body
  try {
    const { username } = data;
    const db = await customerDetails.findOne({ username })
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
    const cart_list = await cart.find({ username });
    const dateObj = new Date
    const date = moment(dateObj).format('YYYY-MM-DD');
    var ol = Object.values(cart_list)
    var orderlist = ol.map(({ id, title, price, quantity }) => ({ id, title, price, quantity }))
    let cartvalue = 0
    orderlist.forEach(data => {
      cartvalue = cartvalue + (+data.price * +data.quantity)
    })
    var { email, paymentMethod } = await customerDetails.findOne({ username })
    const placed = await order.create({ username, orderlist, date, cartvalue, email})
    await cart.deleteMany({ username })
    res.json({ message: "ok", username, orderlist, date, cartvalue, email, paymentMethod, _id: placed._id})
  }
  catch (err) {
    res.status(401).json({
      message: "something went wrong here",
      error: err.mesage
    })
  }
}
