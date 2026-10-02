import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { useComplaints } from '../contexts/ComplaintContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ReportComplaint = () => {
  const { addComplaint } = useComplaints();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'infrastructure',
    description: '',
    location: '',
    priority: 'medium'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addComplaint({ ...formData, student_id: user.id });
    navigate('/student/complaints');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '20px', fontWeight: '600' }}>Report a Complaint</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>TITLE</label>
            <input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief summary of the issue"
              style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>CATEGORY</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              >
                <option value="infrastructure">Infrastructure & Facilities</option>
                <option value="academic">Academic Concerns</option>
                <option value="hostel">Hostel & Accommodation</option>
                <option value="administrative">Administrative</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>PRIORITY</label>
              <select 
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>LOCATION</label>
            <input 
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Building A, Room 302"
              style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>DESCRIPTION</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Provide detailed information about the complaint..."
              style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button 
              type="submit"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '4px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
