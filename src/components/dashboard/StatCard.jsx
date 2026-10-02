import React from 'react';
import { Card } from '../../components/common/Card';
import './StatCard.css';

export const StatCard = ({ title, value, subtitle, topBorderColor }) => {
  return (
    <Card topBorderColor={topBorderColor} className="stat-card">
      <div className="stat-card-title">{title}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-subtitle">{subtitle}</div>
    </Card>
  );
};
