const customerModel = require('../model/customer');
const customer = customerModel.customer;

// Controller function to register a new customer
exports.register_customer = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate username length
    if (username.length < 6 || username.length > 12) {
      return res.status(400).json({ message: "Username length must be between 6 to 12" });
    }

    // Validate password length
    if (password.length < 6 || password.length > 12) {
      return res.status(400).json({ message: "Password length must be between 6 to 12" });
    }

    // Check if username already exists in the database
    const db = await customer.findOne({ username });
    if (!db) {
      // If username does not exist, create a new customer entry
      await customer.create({ username, password });
      res.send({ message: 'User created successfully' });
    } else {
      // If username already exists, return an error message
      res.status(401).json({ message: 'Username already exists' });
    }
  } catch (err) {
    // Handle any errors that occur during registration
    res.status(400).json({
      message: "Failed to register user",
      error: err.message
    });
  }
};
