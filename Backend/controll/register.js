const customerModel = require('../model/customer');
const customer = customerModel.customer;

exports.register_customer = async (req, res) => {
  try {
    const { username, password } = req.body
    if (username.length < 6 || username.length > 12) {
      return res.status(400).json({ message: "username length must be between 6 to 12" })
    }
    if (password.length < 6 || password.length > 12) {
      return res.status(400).json({ message: "Password length must be between 6 to 12" })
    }
    const db = await customer.findOne({username})
    if(!db){
      await customer.create({
        username,
        password
      }).then(
        res.send({message : 'user created successfully'})
      )
    } else {
      res.status(401).json({message : 'User Name already exist'})
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to register User",
      error: err.mesage
    })
  }
}