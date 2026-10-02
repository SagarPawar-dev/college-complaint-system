import React from 'react';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card } from '../../components/common/Card';
import { FileText, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../../contexts/ComplaintContext';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { complaints } = useComplaints();
  const { role, user } = useAuth();

  // If student, only show their complaints
  const visibleComplaints = role === 'admin' 
    ? complaints 
    : complaints.filter(c => c.student_id === user.id);

  const total = visibleComplaints.length;
  const pending = visibleComplaints.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  const inProgress = visibleComplaints.filter(c => c.status === 'in_progress').length;
  const resolved = visibleComplaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;

  return (
    <div className="dashboard">
      {role === 'student' && (
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button 
            className="report-btn" 
            onClick={() => navigate('/student/report')}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <PlusCircle size={18} />
            Report Complaint
          </button>
        </div>
      )}

      <div className="stats-grid">
        <StatCard 
          title="TOTAL COMPLAINTS" 
          value={total} 
          subtitle="All recorded complaints" 
          topBorderColor="blue" 
        />
        <StatCard 
          title="PENDING" 
          value={pending} 
          subtitle="Awaiting action" 
          topBorderColor="yellow" 
        />
        <StatCard 
          title="IN PROGRESS" 
          value={inProgress} 
          subtitle="Currently being handled" 
          topBorderColor="purple" 
        />
        <StatCard 
          title="RESOLVED" 
          value={resolved} 
          subtitle="Successfully closed" 
          topBorderColor="green" 
        />
      </div>

      <Card className="recent-complaints">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1.5rem' }}>Recent Activity</h3>
        
        {visibleComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No complaints found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {visibleComplaints.slice(0, 5).map(complaint => (
              <div 
                key={complaint.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '4px' 
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{complaint.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {complaint.display_id || complaint.id} • {new Date(complaint.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: '600',
                    backgroundColor: complaint.status === 'resolved' ? 'rgba(32, 201, 151, 0.1)' : 'rgba(253, 126, 20, 0.1)',
                    color: complaint.status === 'resolved' ? 'var(--color-green)' : 'var(--color-yellow)',
                    textTransform: 'uppercase'
                  }}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
