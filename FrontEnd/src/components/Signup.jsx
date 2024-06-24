import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../utils/UserApi';
import './Signup.css'; // Import the CSS file

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const validate = () => {
    const errors = {};
    if (!username || username.length < 6 || username.length > 12 || /\s/.test(username)) {
      errors.username = "Username must be 6-12 characters long and contain no spaces.";
    }
    if (!password || password.length < 6 || password.length > 12 || /\s/.test(password)) {
      errors.password = "Password must be 6-12 characters long and contain no spaces.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await api.post('register',{username, password});
        if(response){
            toast.success("User created successfully!");
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        }else{  
        toast.error("Sorry! Username is Taken.");
      }
      } catch (error) {
        toast.error("something went wrong.");
      }
    }
  };

  return (
    <>
      <Toaster />
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Sign Up</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                className={errors.username ? 'input-error' : ''}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <button type="submit" className="signup-button">Sign Up</button>
            <div style={{marginTop:"1rem"}}>already have an account ?{" "}
                <a style={{textDecoration:"underline",cursor:"pointer"}} onClick={() => {navigate('/signin')}}>sign in</a></div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
