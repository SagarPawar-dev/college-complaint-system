import React from 'react';
import { Card } from '../components/common/Card';
import { useComplaints } from '../contexts/ComplaintContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

export const Analytics = () => {
  const { complaints } = useComplaints();

  const statusCount = {
    submitted: 0,
    under_review: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0
  };
  
  const categoryCount = {};

  complaints.forEach(c => {
    statusCount[c.status] = (statusCount[c.status] || 0) + 1;
    categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
  });

  const pieData = [
    { name: 'Pending', value: statusCount.submitted + statusCount.under_review, color: '#fd7e14' },
    { name: 'In Progress', value: statusCount.in_progress, color: '#6f42c1' },
    { name: 'Resolved/Closed', value: statusCount.resolved + statusCount.closed, color: '#20c997' }
  ].filter(d => d.value > 0);

  const barData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <Card topBorderColor="blue">
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Complaints</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{complaints.length}</div>
        </Card>
        <Card topBorderColor="green">
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Resolution Rate</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>
            {complaints.length > 0 ? Math.round(((statusCount.resolved + statusCount.closed) / complaints.length) * 100) : 0}%
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Card style={{ minHeight: '300px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1.5rem' }}>Status Distribution</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card style={{ minHeight: '300px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1.5rem' }}>Complaints by Category</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
