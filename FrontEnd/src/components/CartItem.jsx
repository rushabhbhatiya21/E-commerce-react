import React from "react";
import { useDispatch } from "react-redux";
import api from "../utils/UserApi";
import toast, { Toaster } from 'react-hot-toast';
import { decrease, increase, remove } from "../redux/feature/cartSlice";
import './CartItem.css'; // Import the CSS file

const CartItem = ({ id, thumbnail, title, price, quantity , dispatch}) => {
  // const dispatch = useDispatch();

  const handleDecrement = () => {
    console.log("handling dec")
    if(quantity >0 && quantity <= 10){
      api.put('items/cart', {id, username:localStorage.getItem('username'), quantity:quantity-1})
    }if(quantity)
    dispatch(decrease(id))
  }

  const handleIncrement = () => {
    if(quantity >0 && quantity < 10){
      api.put('items/cart', {id, username:localStorage.getItem('username'), quantity:quantity+1})
    }
    dispatch(increase(id))
  }


  const handleDelete = () => {
    api.put('items/cart', {id, username:localStorage.getItem('username'), quantity:0})
    dispatch(remove(id))
  }
  return (
    <>
    <Toaster />
    <div className="cart-item-container">
      <div className="row cart-item-row">
        <div className="left-item-cont">
          <div className="col-sm-2 cart-item-thumbnail">
            <img
              src={thumbnail}
              className="img-fluid cart-item-image"
              alt=""
            />
          </div>
          <div className="col-sm-2 cart-item-details">
            <h5>{title}</h5>
            <div className="col-sm-8 cart-item-quantity">
              <h5 className="cart-item-price">${price}</h5>
              <div
                className="fas fa-minus cart-item-chevron"
                onClick={handleDecrement}
              ></div>
              <div className="cart-item-quantity-text">{quantity}</div>
              <div
                className="fas fa-plus cart-item-chevron"
                onClick={handleIncrement}
              ></div>
            </div>
          </div>
        </div>
        <div className="right-item-cont">
          <div className="total-price">${ price*quantity }.00</div>
          <button className="deleteItem" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CartItem;
