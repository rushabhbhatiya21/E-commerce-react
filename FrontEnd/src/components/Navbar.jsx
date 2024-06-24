import React from 'react';
import './Navbar.css'; // Import the CSS 
import api from '../utils/UserApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const { totalCount } = useSelector((state) => state.cart);

  const handleSignOut = async (e) => {
    e.preventDefault();
    await api.post('logout');
    localStorage.removeItem('username');
    window.location.href = '/signin';
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        <img src="/src/assets/logo.jpg" alt="SmartMart Logo"/>
      </div>
      <h1 className="navbar-title">SmartMart</h1>
      <div className="navbar-links">
        {!(window.location.href.includes('/signin') || window.location.href.includes('/signup')) && (
          <>
            <a onClick={() => navigate('/')} className="navbar-link">Home</a>
            <div className="cart-container" onClick={() => navigate('/cart')}>
              <a className="navbar-link">Cart</a>
              {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
            </div>
            <a onClick={handleSignOut} className="navbar-link">Sign Out</a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
