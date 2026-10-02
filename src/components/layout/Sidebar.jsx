import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Users, Bell, LogOut, FileBarChart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

export const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/complaints', icon: FileText, label: 'Complaints' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/complaints', icon: FileText, label: 'Complaints' },
    { to: '/student/notifications', icon: Bell, label: 'Notifications' },
    { to: '/student/settings', icon: Settings, label: 'Settings' },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-text">
            <h2>Complaint Desk</h2>
          </div>
        </div>
      </div>
      
      <div className="sidebar-content">
        <div className="nav-section">
          <p className="nav-section-title">WORKSPACE</p>
          <nav className="nav-links">
            {links.map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <link.icon className="nav-icon" size={20} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="sidebar-footer">
        <button 
          className="logout-btn" 
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
