const customerModel = require('../model/customer');
const customer = customerModel.customer;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const ejs = require('ejs');

// Controller function to log out the customer
exports.logout = async (req, res) => {
  // Clear JWT and user cookies to log out
  res.cookie("jwtc", "", { maxAge: "1" });
  res.cookie("user", "", { maxAge: "1" });
  res.send("ok");
};

// Controller function for customer login
exports.customer_login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if username and password are provided
    if (!username || !password) {
      res.send({ message: "Username or Password not present" });
    }
    // Find customer in the database based on username and password
    const custobj = await customer.findOne({ username, password });
    if (!custobj) {
      // If customer not found, return error message
      res.status(400).json({ message: "Login not successful, User not found" });
    } else {
      // If customer found, generate JWT token for authentication
      const maxAge = 72 * 60 * 60; // 3 hours in seconds
      const token = jwt.sign(
        { id: custobj._id, username },
        process.env.JWT_KEY,
        {
          expiresIn: maxAge, // Token expires in 3 hours
        }
      );
      // Set JWT and user cookies with the generated token and username
      res.cookie("jwtc", token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // Convert maxAge to milliseconds
      });
      res.cookie("user", username, {
        httpOnly: true,
        maxAge: maxAge * 1000, // Convert maxAge to milliseconds
      });
      // Respond with success message
      res.send({ message: "Login successful" });
    }
  } catch (error) {
    // Handle any errors that occur during login process
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

// Middleware function to authenticate customer requests using JWT
exports.customerAuth = (req, res, next) => {
  // Extract JWT token from cookies
  const token = req.cookies.jwtc;
  if (token) {
    // Verify JWT token
    jwt.verify(token, process.env.JWT_KEY, (err) => {
      if (err) {
        // If verification fails, respond with unauthorized status
        return res.status(401).json({ message: "Not authorized" });
      } else {
        // If verification succeeds, proceed to the next middleware or route handler
        next();
      }
    });
  } else {
    // If no token is provided, respond with unauthorized status
    res.status(401).json({ message: "Not authorized" });
  }
};
