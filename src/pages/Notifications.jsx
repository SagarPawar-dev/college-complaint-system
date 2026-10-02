import React from 'react';
import { Card } from '../components/common/Card';
import { useComplaints } from '../contexts/ComplaintContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

export const Notifications = () => {
  const { notifications, markNotificationRead } = useComplaints();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const userNotifications = notifications.filter(n => n.user_id === user?.id);

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markNotificationRead(notification.id);
    }
    navigate(`/${role}/complaints/${notification.complaint_id}`);
  };

  return (
    <Card noPadding>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Notifications</h2>
      </div>
      
      <div>
        {userNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Bell size={32} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>You're all caught up! No notifications.</p>
          </div>
        ) : (
          <ul style={{ margin: 0, padding: 0 }}>
            {userNotifications.map(notification => (
              <li 
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: notification.is_read ? 'transparent' : 'rgba(32, 201, 151, 0.05)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '1rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (notification.is_read) e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  if (notification.is_read) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(32, 201, 151, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0
                }}>
                  <Bell size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: notification.is_read ? 'var(--text-main)' : 'var(--primary)' }}>
                      {notification.title}
                    </h4>
                    {!notification.is_read && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-red)' }} />
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {notification.message}
                  </p>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};
