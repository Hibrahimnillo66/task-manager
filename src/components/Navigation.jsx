// components/Navigation.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaCheckCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Navigation = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className={`w-1/6 min-h-screen p-8 shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} relative`}>
      <h2 className="text-2xl font-bold mb-6">Task App</h2>
      <ul className="space-y-4">
        <li>
          <button 
            className="w-full text-left flex items-center p-2 rounded-md hover:text-gray-400 transition duration-200" 
            onClick={() => navigate('/tasks')}
          >
            <FaHome className="mr-2" /> <span>Home</span>
          </button>
        </li>
        <li>
          <button 
            className="w-full text-left flex items-center p-2 rounded-md hover:text-gray-400 transition duration-200" 
            onClick={() => navigate('/completed-tasks')}
          >
            <FaCheckCircle className="mr-2" /> <span>Completed</span>
          </button>
        </li>
        <li>
          <button 
            className="w-full text-left flex items-center p-2 rounded-md hover:text-gray-400 transition duration-200" 
            onClick={() => navigate('/settings')}
          >
            <FaCog className="mr-2" /> <span>Settings</span>
          </button>
        </li>
        <li>
          <button 
            className="w-full text-left flex items-center p-2 rounded-md hover:text-gray-400 transition duration-200" 
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" /> <span>Logout</span>
          </button>
        </li>
      </ul>
      <div className="absolute right-0 top-0 h-full shadow-lg"></div>
    </div>
  );
};

export default Navigation;
