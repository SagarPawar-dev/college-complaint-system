import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (error) throw error;
      
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: data.name,
        role: data.role
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Fallback in case profile is missing
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.email.split('@')[0],
        role: authUser.email.includes('admin') ? 'admin' : 'student'
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return true;
    } catch (err) {
      setError(err.message || 'Failed to sign in');
      return false;
    }
  };

  const updateProfile = async (newName) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: newName })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser(prev => ({ ...prev, name: newName }));
      return true;
    } catch (err) {
      console.error('Error updating profile:', err.message);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading application...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role, error, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
