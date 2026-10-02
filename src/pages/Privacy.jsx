import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { ArrowLeft, Shield, Lock, EyeOff } from 'lucide-react';

export const Privacy = () => {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(13, 110, 253, 0.1)', borderRadius: '50%' }}>
              <Shield size={32} color="var(--primary)" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Privacy Policy</h1>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={18} /> Data Security & Protection
              </h2>
              <p>
                The College Complaint Desk uses enterprise-grade Row Level Security (RLS) provided by our database infrastructure. This ensures that all submitted complaints, personal information, and timeline activities are strictly guarded at the database level. 
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <EyeOff size={18} /> Visibility and Access Control
              </h2>
              <p>
                Your privacy is our priority. Complaint data is explicitly restricted so that:
              </p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Students</strong> can only view, track, and update complaints that they have personally submitted. You cannot see complaints submitted by other students.</li>
                <li><strong>Administrators</strong> have secure access to view all complaints strictly for the purpose of resolution and campus management.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Data Usage
              </h2>
              <p>
                Information collected through this platform is used exclusively for campus maintenance, academic issue resolution, and improving college facilities. We do not share, sell, or distribute your information to any third parties.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};
