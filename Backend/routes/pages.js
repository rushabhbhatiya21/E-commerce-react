const itemsModel = require('../model/items');
const items = itemsModel.items;
const cartModel = require('../model/cart');
const cart = cartModel.cart;
const customerModel = require('../model/customer');
const customer = customerModel.customer;
const orderModel = require('../model/order');
const order = orderModel.orders;
require('dotenv').config();

// Controller function to fetch a single order for generating PDF
exports.order = async (req, res) => {
    try {
        // Retrieve the order details based on the provided order ID
        const order = await order.findOne({ _id: req.params.id });
        res.send(order);
    } catch (error) {
        res.status(400).json({
            message: "An error occurred while fetching order",
            error: error.message,
        });
    }
};

// Controller function to fetch all items
exports.items = async (req, res) => {
    try {
        // Retrieve all items from the items collection
        const item_list = await items.find();
        const username = req.cookies.user;
        // Retrieve user details based on the username
        const user = await customer.findOne({ username });
        // Respond with items and user details
        res.status(200).json({ items: item_list, username: user });
    } catch (error) {
        res.status(400).json({
            message: "An error occurred while fetching items",
            error: error.message,
        });
    }
};

// Controller function to fetch the user's cart
exports.cart = async (req, res) => {
    try {
        const username = req.cookies.user;
        // Retrieve user details based on the username
        const user = await customer.findOne({ username });
        // Retrieve all items in the user's cart
        const cart_list = await cart.find({ username });
        // Respond with cart items and user details
        res.send({ cart: cart_list, user: user });
    } catch (error) {
        res.status(400).json({
            message: "An error occurred while fetching cart items",
            error: error.message,
        });
    }
};

// Controller function to fetch all orders for a user
exports.orders = async (req, res) => {
    try {
        const username = req.cookies.user;
        // Retrieve all orders placed by the user
        const order_list = await order.find({ username });
        // Retrieve user details based on the username
        const user = await customer.findOne({ username });
        // Respond with order list and user details
        res.send({ orders: order_list, user: user });
    } catch (error) {
        res.status(400).json({
            message: "An error occurred while fetching orders",
            error: error.message,
        });
    }
};
