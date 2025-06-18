import React, { useState } from 'react';
import './LoginAndSignup.css';
import axios from 'axios';
import { useApi } from '../../contexts/context';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginAndSignup = () => {
  const navigate = useNavigate();
  const { baseURL, connectSocket } = useApi();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      if (response.data.success) {
        localStorage.setItem('userId', response.data.user._id);
        connectSocket();
        navigate('/mainPage', { state: { user: response.data.user } });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginAndSignup-Container">
      <h1>Lets Chat</h1>
      <div className={`LoginAndSignup-box ${showSignup ? 'show-signup' : ''}`}>
        {loading ? (
          <div className="loading-text">Loading...</div>
        ) : (
          <>
            {/* Login form */}
            <form onSubmit={handleLogin} className="login-form">
              <label>Email</label>
              <input
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p>
                Don't have an account?
                <strong onClick={() => setShowSignup(true)}> Register</strong>
              </p>
              <button type="submit">Login</button>
            </form>

            {/* Signup form */}
            <form onSubmit={handleSignup} className="signup-form">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Email</label>
              <input
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p>
                Already have an account?
                <strong onClick={() => setShowSignup(false)}> Signin</strong>
              </p>
              <button type="submit">Register</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginAndSignup;
