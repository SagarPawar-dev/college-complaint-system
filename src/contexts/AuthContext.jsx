import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [error, setError] = useState('');

  const login = (email, password) => {
    setError('');
    if (email === 'student@example.com' && password === 'student123') {
      setUser({ id: 'user-1', name: 'Student User', role: 'student', email });
      return true;
    } else if (email === 'admin@example.com' && password === 'admin123') {
      setUser({ id: 'admin-1', name: 'System Administrator', role: 'admin', email });
      return true;
    } else {
      setError('Invalid email or password. Use test credentials.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
