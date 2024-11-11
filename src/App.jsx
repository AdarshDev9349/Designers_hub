import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Signup from './components/signupform';
import Profile from './components/profilepage';
import './index.css';
import LoginForm from './components/loginform';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token); // Set true if token exists
  }, []);

  const ProtectedRoute = ({ element }) => {
      return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
      <Router>
          <Routes>
              <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
      </Router>
  );
}

export default App;