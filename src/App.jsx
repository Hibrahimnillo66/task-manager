// App.js
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TaskList from './components/TaskList';
import { FaSun, FaMoon } from 'react-icons/fa';
import { AuthContext } from './context/AuthContext';
import ThemeContext from './context/ThemeContext';

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated]);

  return (
    <div className={theme === 'dark' ? 'dark' : 'light'} style={{ minHeight: '100vh' }}>
      <Router>
        <div className="flex min-h-screen">
          <div className="flex-grow" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/tasks" />} />
              <Route path="/tasks" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />} />
            </Routes>
          </div>
          <button 
            onClick={toggleTheme} 
            className={`absolute top-6 right-8 text-2xl ${theme === 'dark' ? 'text-white' : 'text-black'}`}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </Router>
    </div>
  );
};

export default App;
