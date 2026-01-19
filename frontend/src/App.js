import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Signup from './pages/signup/signup';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} /> / Redirect root to /login
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signup" element={<Signup />} />

    </Routes>
  );
}

export default App;
