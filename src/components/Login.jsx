import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://task-manager-backend-fc9b159cd82e.herokuapp.com/api/authenticate', credentials);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setLoading(false);
      navigate('/tasks');
    } catch (error) {
      console.error('Error logging in', error);
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    try {
      const tokenId = response.credential;
      const res = await axios.post('https://task-manager-backend-fc9b159cd82e.herokuapp.com/api/auth/google', { token: tokenId });
      const token = res.data.token;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setLoading(false);
      navigate('/tasks');
    } catch (error) {
      console.error('Error logging in with Google', error);
      setLoading(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In error', error);
    setLoading(false);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
          {loading ? (
            <div className="flex justify-center">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-800" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input 
                    id="username"
                    type="text" 
                    name="username" 
                    value={credentials.username} 
                    onChange={handleChange} 
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                    placeholder="Username" 
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input 
                    id="password"
                    type="password" 
                    name="password" 
                    value={credentials.password} 
                    onChange={handleChange} 
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                    placeholder="Password" 
                  />
                </div>
              </div>

              <div>
                <button 
                  type="submit" 
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              </div>
            </form>
          )}
          {!loading && (
            <div className="flex items-center justify-center mt-4">
              <div className="text-gray-600">Or</div>
            </div>
          )}
          {!loading && (
            <div>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;