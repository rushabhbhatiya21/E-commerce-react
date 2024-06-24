import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import api from "../utils/UserApi";
import { setCartItems, getCartTotal, clearCart } from "../redux/feature/cartSlice";
import './CartContainer.css'; // Import the CSS file

const CartContainer = () => {
  const { totalAmount, items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [checkNumber, setCheckNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [orderSummary, setOrderSummary] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // To disable the button after click

  useEffect(() => {
    if (items.length <= 0) {
      try {
        api.get('items/cart').then((response) => {
          if (response) {
            dispatch(setCartItems({
              data: response.data["cart"]
            }));
          }
        });
      } catch (err) {
        console.log('failed to get cart', err);
      }
    }
    dispatch(getCartTotal());
  }, [items, dispatch]);

  const validate = () => {
    const errors = {};
    if (!address.trim()) {
      errors.address = "Address is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number is invalid";
    }
    if (paymentMethod === 'Check' && !checkNumber.trim()) {
      errors.checkNumber = "Check number is required";
    }
    return errors;
  };

  const handleCheckout = async () => {
    const errors = validate();
    if (Object.keys(errors).length === 0) {
      setIsButtonDisabled(true); // Disable the button after click
      // Proceed with checkout
      try {
        const payload = { address, email, phone, items, paymentMethod: paymentMethod === 'Check' ? `Check: ${checkNumber}` : paymentMethod, username: localStorage.getItem('username') };
        await api.post('items/cart/details', payload);
        const response = await api.post('items/cart/order', payload);
        if (response.data.message === 'ok') {
          setOrderSummary({
            username: response.data.username,
            orderlist: response.data.orderlist,
            date: response.data.date,
            cartvalue: response.data.cartvalue,
            email: response.data.email,
            _id: response.data._id,
            paymentMethod : response.data.paymentMethod
          });
          setIsOrderSummaryOpen(true);
          setIsModalOpen(false);
        }
      } catch (error) {
        console.log('Checkout failed', error);
        setIsButtonDisabled(false); // Re-enable the button if the checkout fails
      }
    } else {
      setErrors(errors);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setAddress('');
    setEmail('');
    setPhone('');
    setPaymentMethod('Cash on Delivery');
    setCheckNumber('');
    setErrors({});
  };

  const handleOrderSummaryClose = () => {
    setIsOrderSummaryOpen(false);
    setOrderSummary(null);
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <>
        <h3 className="fs-bold" style={{ marginTop: "20px", textAlign: 'center' }}>
          Your Shopping <span className="shopping-icon"></span> is Empty
        </h3>
      </>
    );
  }

  return (
    <div style={{marginTop:'25px'}}>
      {items.map((item) => {
        return <CartItem key={item.id} {...item} dispatch={dispatch}/>;
      })}
      <footer>
        <hr style={{width:"70vw"}} />
        <div style={{display:'flex',width:"98vw",justifyContent:'center'}}>
          <h4
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginLeft:"25px",
              width:"68vw"
            }}
          >
            Total <span>${totalAmount}.00</span>
          </h4>
        </div>
        <div className="checkout-container">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            Checkout
          </button>
        </div>
      </footer>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Checkout</h2>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <p className="error">{errors.address}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>
            {paymentMethod === 'Check' && (
              <div className="form-group">
                <label htmlFor="checkNumber">Check Number</label>
                <input
                  type="text"
                  id="checkNumber"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                />
                {errors.checkNumber && <p className="error">{errors.checkNumber}</p>}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Check">Check</option>
              </select>
            <button className="btn btn-primary abs-btn" onClick={handleCheckout} disabled={isButtonDisabled}>
              Confirm Order
            </button>
            </div>
            
          </div>
        </div>
      )}

      {isOrderSummaryOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleOrderSummaryClose}>&times;</span>
            <h2>Order Summary</h2>
            <p>Order placed successfully!</p>
            <p><strong>Order ID: </strong>{orderSummary._id}</p>
            <p><strong>Username: </strong>{orderSummary.username}</p>
            <p><strong>Email: </strong>{orderSummary.email}</p>
            <p><strong>Date: </strong>{orderSummary.date}</p>
            <p><strong>Total Value: </strong>${orderSummary.cartvalue}.00</p>
            <p><strong>Payment Method: </strong>{orderSummary.paymentMethod}</p>
            <h3>Order List:</h3>
            <ul>
              {orderSummary.orderlist.map((item) => (
                <li key={item.id}>
                  {item.title} - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartContainer;
