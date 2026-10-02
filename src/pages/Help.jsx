import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { ArrowLeft, Mail, Phone } from 'lucide-react';

export const Help = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '2rem', fontWeight: '500' }}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <Card>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Help & Contact</h1>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-main)' }}>Using the Complaint Desk</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              The College Complaint Desk is designed to make reporting and tracking campus issues simple and transparent.
            </p>
            <ul style={{ color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Submit a Complaint:</strong> Log in to the Student Portal, click "Report Issue", and fill out the details including the specific location and category.</li>
              <li><strong>Track Status:</strong> View your dashboard to see real-time updates as administrators review and resolve your issue.</li>
              <li><strong>Reopen an Issue:</strong> If a resolved issue occurs again, you can easily reopen it from the complaint details page.</li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-main)' }}>Contact Administration</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.75rem' }}>Technical Support (IT)</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <Mail size={16} /> it.support@college.edu
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <Phone size={16} /> Ext: 1010
                </div>
              </div>

              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.75rem' }}>Campus Maintenance</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <Mail size={16} /> facilities@college.edu
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <Phone size={16} /> Ext: 2020
                </div>
              </div>

            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
