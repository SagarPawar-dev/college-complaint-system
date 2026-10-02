import React from 'react';
import { Menu, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../../contexts/ComplaintContext';
import { useAuth } from '../../contexts/AuthContext';
import './TopBar.css';

export const TopBar = ({ title, subtitle, userRole, userName, toggleSidebar }) => {
  const navigate = useNavigate();
  const { notifications } = useComplaints();
  const { user } = useAuth();

  const unreadCount = notifications.filter(n => n.user_id === user?.id && !n.is_read).length;

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
      
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

        <div className="user-profile">
          <div className="user-avatar">
            <User size={20} color="var(--primary)" />
          </div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole?.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
