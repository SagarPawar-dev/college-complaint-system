import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../../contexts/ComplaintContext';
import { useAuth } from '../../contexts/AuthContext';
import './TopBar.css';

export const TopBar = ({ title, subtitle, userRole, userName, toggleSidebar }) => {
  const navigate = useNavigate();
  const { notifications } = useComplaints();
  const { user, logout } = useAuth();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.user_id === user?.id && !n.is_read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="page-header-text">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      
      <div className="topbar-right" style={{ gap: '1.5rem' }}>
        <button 
          onClick={() => navigate(`/${userRole}/notifications`)}
          style={{ background: 'transparent', position: 'relative', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: 'var(--color-red)',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        <div className="profile-dropdown-container" ref={dropdownRef}>
          <div className="user-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="user-avatar">
              <User size={20} color="var(--primary)" />
            </div>
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">{userRole?.toUpperCase()}</span>
            </div>
            <ChevronDown size={16} color="var(--text-muted)" style={{ display: 'none' }} className="desktop-chevron" />
          </div>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <span className="user-name">{userName}</span>
                <span className="user-role">{userRole?.toUpperCase()}</span>
              </div>
              
              <button 
                className="dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate(`/${userRole}/settings`);
                }}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
              
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
