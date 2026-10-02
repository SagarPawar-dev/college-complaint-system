import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Activity, CheckCircle, Shield, Smartphone, MessageSquare } from 'lucide-react';
import { Card } from '../components/common/Card';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Bar */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
            C
          </div>
          <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>Complaint Desk</span>
        </div>
        <div>
          <button 
            onClick={() => navigate('/login')}
            style={{ padding: '0.6rem 1.2rem', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: 'white' }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ width: '100%', maxWidth: '1200px', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', lineHeight: '1.1', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              A Better Campus, <br/><span style={{ color: 'var(--primary)' }}>Together.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '500px' }}>
              A transparent, efficient platform to report campus issues, track progress, and get things resolved instantly.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={() => navigate('/login')}
                style={{ padding: '0.875rem 1.5rem', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: 'white', fontSize: '1rem', boxShadow: '0 4px 12px rgba(13, 110, 253, 0.2)' }}
              >
                Login to Portal
              </button>
            </div>
          </div>

          {/* Hero Mockup */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--primary)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }} />
            <div style={{ transform: 'rotate(2deg)' }}>
              <Card topBorderColor="blue" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.25rem' }}>WiFi Dropouts in Library</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CMP-00042 • Reported Today</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '12px', backgroundColor: 'rgba(253, 126, 20, 0.1)', color: 'var(--color-yellow)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>In Progress</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                  <p style={{ fontSize: '13px', fontWeight: '500' }}>Admin Response: "IT is actively investigating the router."</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div style={{ width: '100%', backgroundColor: 'white', padding: '4rem 2rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '0.5rem' }}>How It Works</h2>
              <p style={{ color: 'var(--text-muted)' }}>A streamlined process for resolving your issues.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              
              <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(13, 110, 253, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <FileText size={28} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.75rem' }}>1. Report</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>Submit detailed maintenance, academic, or campus issues instantly.</p>
              </div>

              <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(111, 66, 193, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <Activity size={28} color="var(--color-purple)" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.75rem' }}>2. Track</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>Watch your complaint move through the timeline in real-time.</p>
              </div>

              <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(32, 201, 151, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <CheckCircle size={28} color="var(--color-green)" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '0.75rem' }}>3. Resolve</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>Administrators communicate directly with you to ensure satisfaction.</p>
              </div>

            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div style={{ width: '100%', maxWidth: '1200px', padding: '4rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Shield size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Anonymous & Secure</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Powered by enterprise-grade row level security to protect your identity.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Smartphone size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Accessible Anywhere</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Submit and track your complaints effortlessly across all devices on campus.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <MessageSquare size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Direct Communication</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No more lost emails. Get instant notifications when admins respond.</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ padding: '3rem 2rem 2rem 2rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ maxWidth: '300px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)' }}>Complaint Desk</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>A modern administrative platform dedicated to resolving campus issues transparently and efficiently.</p>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '13px', fontWeight: '500' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Login</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/help'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Help / Contact</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>&copy; 2026 College Complaint Desk</p>
        </div>
      </footer>
    </div>
  );
};
