import React from 'react';
import { Card } from '../components/common/Card';
import { useComplaints } from '../contexts/ComplaintContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ComplaintsList = () => {
  const { complaints } = useComplaints();
  const { role, user } = useAuth();
  const navigate = useNavigate();

  const visibleComplaints = role === 'admin' 
    ? complaints 
    : complaints.filter(c => c.student_id === user.id);

  const getStatusColor = (status) => {
    switch(status) {
      case 'submitted': return { bg: 'rgba(13, 110, 253, 0.1)', text: 'var(--color-blue)' };
      case 'under_review': return { bg: 'rgba(111, 66, 193, 0.1)', text: 'var(--color-purple)' };
      case 'in_progress': return { bg: 'rgba(253, 126, 20, 0.1)', text: 'var(--color-yellow)' };
      case 'resolved': return { bg: 'rgba(32, 201, 151, 0.1)', text: 'var(--color-green)' };
      case 'closed': return { bg: 'rgba(108, 117, 125, 0.1)', text: 'var(--color-gray)' };
      default: return { bg: '#eee', text: '#333' };
    }
  };

  return (
    <Card noPadding>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{role === 'admin' ? 'All Complaints' : 'My Complaints'}</h2>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>ID</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Title</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Category</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Priority</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No complaints found.
                </td>
              </tr>
            ) : (
              visibleComplaints.map(complaint => {
                const statusColor = getStatusColor(complaint.status);
                return (
                  <tr 
                    key={complaint.id} 
                    style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onClick={() => navigate(`/${role}/complaints/${complaint.id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{complaint.display_id || complaint.id}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{complaint.title}</td>
                    <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{complaint.category}</td>
                    <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{complaint.priority}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '11px', 
                        fontWeight: '600',
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        textTransform: 'uppercase'
                      }}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
