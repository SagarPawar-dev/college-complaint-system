import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { supabase } from '../../lib/supabase';
import { User, FileText } from 'lucide-react';
import { useComplaints } from '../../contexts/ComplaintContext';
import { useNavigate } from 'react-router-dom';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const { complaints } = useComplaints();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserExpanded = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading users...</div>;
  }

  const filteredUsers = users.filter(u => roleFilter === 'all' ? true : u.role === roleFilter);

  return (
    <Card noPadding>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>User Management</h2>
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </select>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>USER</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>EMAIL</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>ROLE</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>STATUS</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>COMPLAINTS</th>
              <th style={{ padding: '1rem 1.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(userProfile => {
              const userComplaints = complaints.filter(c => c.student_id === userProfile.id);
              const isExpanded = expandedUserId === userProfile.id;
              
              return (
                <React.Fragment key={userProfile.id}>
                  <tr 
                    style={{ 
                      borderBottom: isExpanded ? 'none' : '1px solid var(--border-color)', 
                      cursor: 'pointer',
                      backgroundColor: isExpanded ? '#f8f9fa' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => toggleUserExpanded(userProfile.id)}
                    onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                    onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '600' }}>{userProfile.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>STU-{userProfile.id.substring(0, 4).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                      {userProfile.email || '-'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: userProfile.role === 'admin' ? 'rgba(111, 66, 193, 0.1)' : 'rgba(13, 110, 253, 0.1)',
                        color: userProfile.role === 'admin' ? 'var(--color-purple)' : 'var(--color-blue)',
                        textTransform: 'uppercase'
                      }}>
                        {userProfile.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', color: 'var(--color-green)' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }} />
                        Active
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>
                      {userComplaints.length}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUserExpanded(userProfile.id);
                        }}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: isExpanded ? 'var(--bg-main)' : 'transparent',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          color: 'var(--text-main)',
                          fontSize: '13px',
                          transition: 'all 0.2s'
                        }}
                      >
                        {isExpanded ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid var(--border-color)' }}>
                      <td colSpan="5" style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '1rem' }}>
                          <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                            Complaints by {userProfile.name}
                          </h4>
                          {userComplaints.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No complaints found for this user.</div>
                          ) : (
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {userComplaints.map(c => (
                                <li 
                                  key={c.id}
                                  onClick={() => navigate(`/admin/complaints/${c.id}`)}
                                  style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    padding: '1rem', 
                                    backgroundColor: 'var(--bg-card)', 
                                    borderRadius: '6px', 
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    border: '1px solid var(--border-color)',
                                    transition: 'border-color 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FileText size={16} color="var(--primary)" />
                                    <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{c.display_id || c.id}</span>
                                    <span style={{ fontWeight: '500' }}>{c.title}</span>
                                  </div>
                                  <span style={{ 
                                    padding: '4px 10px', 
                                    borderRadius: '12px', 
                                    backgroundColor: 'rgba(0,0,0,0.05)', 
                                    textTransform: 'capitalize',
                                    fontWeight: '500'
                                  }}>
                                    {c.status.replace('_', ' ')}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
