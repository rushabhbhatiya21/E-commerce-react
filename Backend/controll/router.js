const express = require("express");
const router = express.Router();
const cont = require("./longin");
const page = require("./pages");
const reg = require("./register")
const cart = require("./cart")

router
.post('/register', reg.register_customer)
.post('/login', cont.clogin)
.post('/logout',cont.logout)
.get('/items',cont.customerAuth,page.items)
.get('/items/cart',cont.customerAuth,page.cart)
.get('/items/orders',cont.customerAuth,page.orders)
.get('/items/orders/:id',page.order)//user visible
.post('/items/cart',cont.customerAuth,cart.addtocart)//cart
.post('/items/cart/getdetails',cont.customerAuth,cart.getdetails)
.post('/items/cart/details',cont.customerAuth,cart.adddetails)
.post('/items/cart/order',cont.customerAuth,cart.order)
.put('/items/cart',cont.customerAuth,cart.puttoitem)
.delete('/items/cart',cont.customerAuth,cart.deletitem)
.get('/',(req,res)=>{res.redirect("/login")})
.get('/*',(req,res)=>{res.send("login")})

module.exports = router;