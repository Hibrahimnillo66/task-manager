import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import { AuthProvider, AuthContext } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={isAuthenticated ? <TaskList /> : <Login />} />
        <Route path="/task/:id" element={isAuthenticated ? <TaskForm /> : <Login />} />
        <Route path="/task/new" element={isAuthenticated ? <TaskForm /> : <Login />} />
        <Route path="/" element={isAuthenticated ? <TaskList /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
