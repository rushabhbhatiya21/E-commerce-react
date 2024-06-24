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

// Controller function to add items to the cart
exports.add_to_cart = async (req, res) => {
  const data = req.body;
  try {
    const { id, title, username, quantity, price, thumbnail } = data;
    
    // Check if item already exists in the cart
    const db = await cart.findOne({ username, id });
    if (!db) {
      // If item does not exist, create a new entry in the cart
      await cart.create({ id, title, username, quantity, price, thumbnail });
      var mess = "added to the cart";
    } else {
      // If item exists, update its quantity
      let doc = await cart.findOneAndUpdate({ username, id }, { quantity: db.quantity + quantity });
      doc = await cart.findOne({ username, id });
      var mess = "updated Quantity " + doc.quantity;
    }
    res.status(200).json({
      message: mess
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Item not added",
      error: err.message
    });
  }
};

// Controller function to update or delete an item in the cart
exports.put_to_item = async (req, res) => {
  const data = req.body;
  try {
    const { id, username, quantity } = data;
    if (quantity > 0) {
      // If quantity is greater than 0, update the quantity of the item in the cart
      await cart.findOneAndUpdate({ username, id }, { quantity });
    } else {
      // If quantity is 0 or less, delete the item from the cart
      await cart.findOneAndDelete({ username, id });
    }
    res.send();
  } catch (err) {
    res.status(401).json({
      message: "something went wrong",
      error: err.message
    });
  }
};

// Controller function to delete an item from the cart
exports.delete_item = async (req, res) => {
  const data = req.body;
  try {
    const { id, username } = data;
    // Delete the specified item from the cart
    await cart.findOneAndDelete({ username, id });
    res.send();
  } catch (err) {
    res.status(401).json({
      message: "something went wrong",
      error: err.message
    });
  }
};

// Controller function to add or update customer details
exports.add_details = async (req, res) => {
  const data = req.body;
  try {
    const { username, email, phone, address, paymentMethod } = data;
    // Check if customer details already exist
    const db = await customerDetails.findOne({ username });
    if (!db) {
      // If details do not exist, create a new entry in customer details
      await customerDetails.create({ username, email, phone, address, paymentMethod });
      var mess = "Order Placed And Details Added";
    } else {
      // If details exist, update the existing details
      await customerDetails.findOneAndUpdate({ username }, { email, phone, address, paymentMethod }, { runValidators: true });
      var mess = "Order Placed And Details Updated";
    }
    res.status(200).json({
      message: mess
    });
  } catch (err) {
    res.status(401).json({
      message: "N",
      error: err.message
    });
  }
};

// Controller function to get customer details
exports.get_details = async (req, res) => {
  const data = req.body;
  try {
    const { username } = data;
    // Retrieve customer details for the given username
    const db = await customerDetails.findOne({ username });
    var mess;
    if (!db) {
      mess = { email: "", phone: "" };
    } else {
      mess = { email: db.email, phone: db.phone };
    }
    res.status(200).json({
      message: mess
    });
  } catch (err) {
    res.status(401).json({
      message: "something went wrong",
      error: err.message
    });
  }
};

// Controller function to place an order
exports.order = async (req, res) => {
  const username = req.cookies.user;
  try {
    // Retrieve items in the cart for the user
    const cart_list = await cart.find({ username });
    const dateObj = new Date();
    const date = moment(dateObj).format('YYYY-MM-DD');
    
    // Map cart items to the required format for order creation
    const orderlist = cart_list.map(({ id, title, price, quantity }) => ({ id, title, price, quantity }));
    
    // Calculate total cart value
    let cartvalue = 0;
    orderlist.forEach(data => {
      cartvalue += (+data.price * +data.quantity);
    });
    
    // Retrieve customer email and payment method for the order
    const { email, paymentMethod } = await customerDetails.findOne({ username });
    
    // Create a new order entry
    const placed = await order.create({ username, orderlist, date, cartvalue, email });
    
    // Clear the cart after placing the order
    await cart.deleteMany({ username });
    
    // Respond with order details
    res.json({ message: "ok", username, orderlist, date, cartvalue, email, paymentMethod, _id: placed._id });
  } catch (err) {
    res.status(401).json({
      message: "something went wrong here",
      error: err.message
    });
  }
};
