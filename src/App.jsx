import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import { LoginPage } from './pages/auth/LoginPage';

// Pages
import { ComplaintsList } from './pages/ComplaintsList';
import { ReportComplaint } from './pages/ReportComplaint';
import { ComplaintDetail } from './pages/ComplaintDetail';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to their own dashboard if they try to access wrong role routes
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Root redirect */}
      <Route path="/" element={
        user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/login" replace />
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AppLayout role="admin" userName={user?.name} />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="complaints" element={<ComplaintsList />} />
        <Route path="complaints/:id" element={<ComplaintDetail />} />
        <Route path="users" element={<PlaceholderPage title="User Management" />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute requiredRole="student">
          <AppLayout role="student" userName={user?.name} />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="complaints" element={<ComplaintsList />} />
        <Route path="complaints/:id" element={<ComplaintDetail />} />
        <Route path="report" element={<ReportComplaint />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Catch-all */}
      <Route path="*" element={
        user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/login" replace />
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;
