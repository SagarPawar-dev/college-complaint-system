import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    if (!user) {
      setComplaints([]);
      setNotifications([]);
      return;
    }

    try {
      // 1. Fetch complaints
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('complaints')
        .select(`
          *,
          profiles(name),
          activities (
            *
          )
        `)
        .order('created_at', { ascending: false });
        
      if (complaintsError) throw complaintsError;

      // Sort activities inside each complaint
      const formattedComplaints = complaintsData.map(c => ({
        ...c,
        id: c.id, 
        display_id: `CMP-${String(c.display_id).padStart(5, '0')}`,
        activities: (c.activities || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }));
      setComplaints(formattedComplaints);

      // 2. Fetch notifications
      const { data: notifData, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (notifError) throw notifError;
      setNotifications(notifData || []);

    } catch (err) {
      console.error("Error loading data:", err.message);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addNotification = async (userId, type, title, message, complaintId) => {
    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        type,
        title,
        message,
        complaint_id: complaintId
      });
      loadData();
    } catch (err) {
      console.error('Error adding notification:', err.message);
    }
  };

  const markNotificationRead = async (id) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch (err) {
      console.error('Error marking read:', err.message);
    }
  };

  const addComplaint = async (complaintData) => {
    try {
      // 1. Insert complaint
      const { data: newComplaint, error: complaintError } = await supabase
        .from('complaints')
        .insert({
          title: complaintData.title,
          category: complaintData.category,
          description: complaintData.description,
          location: complaintData.location,
          priority: complaintData.priority,
          student_id: user.id,
          status: 'submitted'
        })
        .select()
        .single();
        
      if (complaintError) throw complaintError;

      // 2. Insert initial activity
      await supabase.from('activities').insert({
        complaint_id: newComplaint.id,
        activity_type: 'created'
      });

      await loadData();
      return newComplaint;
    } catch (err) {
      console.error('Error adding complaint:', err.message);
      throw err;
    }
  };

  const updateComplaintStatus = async (id, newStatus, content) => {
    try {
      const complaint = complaints.find(c => c.id === id);
      if (!complaint) return;

      // If student reopening
      if (user.role === 'student' && newStatus === 'under_review') {
        const { error } = await supabase.rpc('reopen_complaint', { p_complaint_id: id });
        if (error) throw error;
        await loadData();
        return;
      }

      // Admin updates status
      const { error: updateError } = await supabase
        .from('complaints')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (updateError) throw updateError;

      // Insert activity
      await supabase.from('activities').insert({
        complaint_id: id,
        activity_type: 'status_change',
        old_status: complaint.status,
        new_status: newStatus,
        content: content
      });

      // Send notification to student
      if (complaint.status !== newStatus) {
        await addNotification(
          complaint.student_id,
          'status_change',
          'Complaint Status Updated',
          `Your complaint ${complaint.display_id} has been ${newStatus.replace('_', ' ')}.`,
          id
        );
      }

      await loadData();
    } catch (err) {
      console.error('Error updating status:', err.message);
    }
  };
  
  const addResponse = async (id, content) => {
    try {
      const complaint = complaints.find(c => c.id === id);
      if (!complaint) return;

      await supabase.from('activities').insert({
        complaint_id: id,
        activity_type: 'response',
        content: content
      });

      // Notify student
      await addNotification(
        complaint.student_id,
        'new_response',
        'New Response Received',
        `An admin responded to your complaint ${complaint.display_id}.`,
        id
      );

      await loadData();
    } catch (err) {
      console.error('Error adding response:', err.message);
    }
  };

  return (
    <ComplaintContext.Provider value={{ 
      complaints, addComplaint, updateComplaintStatus, addResponse,
      notifications, markNotificationRead 
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => useContext(ComplaintContext);
