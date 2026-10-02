import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', topBorderColor, noPadding = false }) => {
  const style = topBorderColor ? { borderTop: `4px solid var(--color-${topBorderColor})` } : {};
  
  return (
    <div 
      className={`custom-card ${noPadding ? 'no-padding' : ''} ${className}`} 
      style={style}
    >
      {children}
    </div>
  );
};
