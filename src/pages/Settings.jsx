import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const { user, role, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    const success = await updateProfile(name);
    if (success) {
      setSaveMessage('Profile updated successfully!');
    } else {
      setSaveMessage('Failed to update profile.');
    }
    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <Card>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '1.5rem' }}>Account Settings</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>PROFILE NAME</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              />
              <button 
                onClick={handleSave}
                disabled={isSaving || name === user?.name}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: '600',
                  cursor: (isSaving || name === user?.name) ? 'not-allowed' : 'pointer',
                  opacity: (isSaving || name === user?.name) ? 0.7 : 1,
                }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
            {saveMessage && (
              <span style={{ fontSize: '13px', color: saveMessage.includes('Failed') ? 'var(--color-red)' : 'var(--color-green)' }}>
                {saveMessage}
              </span>
            )}
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
            <button 
              onClick={handleLogout}
              style={{ padding: '0.75rem', border: '1px solid var(--color-red)', color: 'var(--color-red)', borderRadius: '4px', backgroundColor: 'transparent', textAlign: 'left', fontWeight: '500', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
