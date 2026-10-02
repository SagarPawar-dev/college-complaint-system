import React from 'react';
import { Card } from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <Card>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '1.5rem' }}>Account Settings</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>PROFILE NAME</label>
            <input 
              defaultValue={user.name}
              style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>ROLE</label>
            <input 
              value={role.toUpperCase()}
              disabled
              style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.5rem' }}>Security</h3>
            {role === 'admin' && (
              <button style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'transparent', textAlign: 'left', fontWeight: '500', cursor: 'pointer' }}>
                Change Password
              </button>
            )}
            <button 
              onClick={handleLogout}
              style={{ marginTop: role === 'admin' ? '0.5rem' : '0', padding: '0.75rem', border: '1px solid var(--color-red)', color: 'var(--color-red)', borderRadius: '4px', backgroundColor: 'transparent', textAlign: 'left', fontWeight: '500', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
