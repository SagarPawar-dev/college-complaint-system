import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/common/Card';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '0.5rem' }}>Complaint Desk</h1>
          <p style={{ color: 'var(--text-muted)' }}>Login to manage complaints</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(220, 53, 69, 0.1)', color: 'var(--color-red)', borderRadius: '4px', fontSize: '13px', fontWeight: '500' }}>
                {error}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>EMAIL</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>PASSWORD</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              />
            </div>
            
            <button 
              type="submit"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '4px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              Sign In
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};
