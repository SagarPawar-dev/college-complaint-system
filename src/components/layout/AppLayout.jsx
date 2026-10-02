import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const AppLayout = ({ role, userName }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Simple title mapping based on route
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return { title: 'Dashboard', subtitle: 'Complaint tracking overview' };
    if (path.includes('complaints')) return { title: 'Complaints', subtitle: 'Manage and track issues' };
    if (path.includes('report')) return { title: 'Report Issue', subtitle: 'Submit a new complaint' };
    if (path.includes('users')) return { title: 'User Management', subtitle: 'Manage system users' };
    if (path.includes('analytics')) return { title: 'Analytics', subtitle: 'System statistics and trends' };
    if (path.includes('settings')) return { title: 'Settings', subtitle: 'Account preferences' };
    return { title: 'Complaint Desk', subtitle: '' };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="app-container">
      <Sidebar role={role} isOpen={sidebarOpen} />
      <div className="main-content-wrapper">
        <TopBar 
          title={title} 
          subtitle={subtitle} 
          userRole={role} 
          userName={userName} 
          toggleSidebar={toggleSidebar} 
        />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
