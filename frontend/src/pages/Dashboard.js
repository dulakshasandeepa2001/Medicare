import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title-section">
            <h2>Dashboard</h2>
            <p className="welcome-message">Welcome back, Admin! 👋</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="dashboard-content">
          <div className="content-header">
            <h3>📊 Overview</h3>
            <p>Welcome to your Medicare Management Dashboard. Here you can manage all healthcare services and patient information.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Patients</h4>
              <div className="number">1,234</div>
            </div>
            <div className="stat-card">
              <h4>Active Cases</h4>
              <div className="number">45</div>
            </div>
            <div className="stat-card">
              <h4>Appointments</h4>
              <div className="number">128</div>
            </div>
            <div className="stat-card">
              <h4>Staff Members</h4>
              <div className="number">67</div>
            </div>
          </div>

          <div className="quick-nav">
            <h4>🗂️ Quick Navigation</h4>
            <div className="nav-buttons">
              <button className="nav-btn">👥 Patients</button>
              <button className="nav-btn">📅 Appointments</button>
              <button className="nav-btn">📋 Reports</button>
              <button className="nav-btn">⚙️ Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
