const express = require("express");
const router = express.Router();
const cont = require("./longin");
const page = require("./pages");
const reg = require("./register")
const cart = require("./cart")

router
.post('/register', reg.register_customer)
.post('/login', cont.customer_login)
.post('/logout',cont.logout)
.get('/items',cont.customerAuth,page.items)
.get('/items/cart',cont.customerAuth,page.cart)
.post('/items/cart',cont.customerAuth,cart.add_to_cart)//cart
.post('/items/cart/get_details',cont.customerAuth,cart.get_details)
.post('/items/cart/details',cont.customerAuth,cart.add_details)
.post('/items/cart/order',cont.customerAuth,cart.order)
.put('/items/cart',cont.customerAuth,cart.put_to_item)
.delete('/items/cart',cont.customerAuth,cart.delete_item)
.get('/',(req,res)=>{res.redirect("/login")})
.get('/*',(req,res)=>{res.send("login")})

module.exports = router;