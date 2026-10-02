import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { useComplaints } from '../contexts/ComplaintContext';
import { useAuth } from '../contexts/AuthContext';

export const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, updateComplaintStatus, addResponse } = useComplaints();
  const { role } = useAuth();
  
  const complaint = complaints.find(c => c.id === id);
  const [responseText, setResponseText] = useState('');

  if (!complaint) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Complaint Not Found</h2>
        <button onClick={() => navigate(`/${role}/complaints`)} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Back to List</button>
      </div>
    );
  }

  const handleStatusChange = (e) => {
    updateComplaintStatus(id, e.target.value, `Status changed to ${e.target.value.replace('_', ' ')}`);
  };

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    addResponse(id, responseText);
    setResponseText('');
  };

  const handleReopen = () => {
    updateComplaintStatus(id, 'under_review', 'Student requested to reopen the complaint.');
  };

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

  const statusColor = getStatusColor(complaint.status);

  return (
    <div className="detail-grid">
      
      {/* Main Detail Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Card topBorderColor={complaint.priority === 'high' || complaint.priority === 'urgent' ? 'red' : 'blue'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '0.5rem' }}>{complaint.title}</h2>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {complaint.display_id || complaint.id} • Created on {new Date(complaint.created_at).toLocaleString()}
              </div>
            </div>
            <span style={{ 
              padding: '6px 12px', 
              borderRadius: '16px', 
              fontSize: '12px', 
              fontWeight: '600',
              backgroundColor: statusColor.bg,
              color: statusColor.text,
              textTransform: 'uppercase'
            }}>
              {complaint.status.replace('_', ' ')}
            </span>
          </div>

          <div className="info-grid" style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.25rem' }}>Category</div>
              <div style={{ textTransform: 'capitalize' }}>{complaint.category}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.25rem' }}>Priority</div>
              <div style={{ textTransform: 'capitalize' }}>{complaint.priority}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.25rem' }}>Location</div>
              <div>{complaint.location || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.25rem' }}>Student ID</div>
              <div>STU-{complaint.student_id.substring(0, 4).toUpperCase()}</div>
            </div>
            {role === 'admin' && (
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.25rem' }}>Student Name</div>
                <div>{complaint.profiles?.name || 'Unknown Student'}</div>
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Description</h3>
            <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{complaint.description}</p>
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1.5rem' }}>Activity Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {complaint.activities.map((activity, index) => (
              <div key={activity.id} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '4px' }} />
                  {index !== complaint.activities.length - 1 && (
                    <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                  )}
                </div>
                <div style={{ paddingBottom: index !== complaint.activities.length - 1 ? '1rem' : '0' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {new Date(activity.created_at).toLocaleString()}
                  </div>
                  <div style={{ fontWeight: activity.activity_type === 'response' ? '400' : '600' }}>
                    {activity.activity_type === 'created' && 'Complaint submitted.'}
                    {activity.activity_type === 'status_change' && `Status changed to ${activity.new_status.replace('_', ' ')}.`}
                    {activity.activity_type === 'response' && (
                      <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: '4px', marginTop: '0.5rem', borderLeft: '3px solid var(--primary)' }}>
                        {activity.content}
                      </div>
                    )}
                  </div>
                  {activity.activity_type === 'status_change' && activity.content && (
                     <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{activity.content}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sidebar Area (Actions) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {role === 'admin' ? (
          <>
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Update Status</h3>
              <select 
                value={complaint.status} 
                onChange={handleStatusChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', marginBottom: '1rem' }}
              >
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </Card>

            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Add Response</h3>
              <form onSubmit={handleResponseSubmit}>
                <textarea 
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type a message to the student..."
                  rows={4}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', resize: 'vertical', marginBottom: '1rem' }}
                />
                <button 
                  type="submit"
                  disabled={!responseText.trim()}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: responseText.trim() ? 'pointer' : 'not-allowed',
                    opacity: responseText.trim() ? 1 : 0.7
                  }}
                >
                  Send Response
                </button>
              </form>
            </Card>
          </>
        ) : (
          /* Student Actions */
          complaint.status === 'resolved' && (
            <Card>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Not satisfied?</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                If this issue has not been fully resolved, you can reopen the complaint for further review.
              </p>
              <button 
                onClick={handleReopen}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: 'var(--color-red)',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  fontWeight: '600',
                  border: '1px solid var(--color-red)',
                  cursor: 'pointer'
                }}
              >
                Reopen Complaint
              </button>
            </Card>
          )
        )}
      </div>
    </div>
  );
};
