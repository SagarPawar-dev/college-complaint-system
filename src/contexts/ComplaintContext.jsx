import React, { createContext, useContext, useState } from 'react';

const ComplaintContext = createContext();

const mockComplaints = [
  {
    id: 'CMP-00001',
    title: 'Broken projector in Room 302',
    category: 'infrastructure',
    description: 'The projector is not turning on. It seems the power cable is faulty.',
    location: 'Building A, Room 302',
    priority: 'high',
    status: 'submitted',
    student_id: 'user-1',
    created_at: new Date(Date.now() - 100000000).toISOString(),
    activities: [
      {
        id: 'act-1',
        activity_type: 'created',
        created_at: new Date(Date.now() - 100000000).toISOString(),
      }
    ]
  },
  {
    id: 'CMP-00002',
    title: 'Hostel WiFi dropping constantly',
    category: 'hostel',
    description: 'The WiFi on the 3rd floor of the boys hostel drops every 10 minutes.',
    location: 'Boys Hostel, 3rd Floor',
    priority: 'medium',
    status: 'in_progress',
    student_id: 'user-1',
    created_at: new Date(Date.now() - 500000000).toISOString(),
    activities: [
      {
        id: 'act-2',
        activity_type: 'created',
        created_at: new Date(Date.now() - 500000000).toISOString(),
      },
      {
        id: 'act-3',
        activity_type: 'status_change',
        old_status: 'submitted',
        new_status: 'under_review',
        created_at: new Date(Date.now() - 400000000).toISOString(),
      },
      {
        id: 'act-4',
        activity_type: 'status_change',
        old_status: 'under_review',
        new_status: 'in_progress',
        created_at: new Date(Date.now() - 300000000).toISOString(),
      }
    ]
  },
  {
    id: 'CMP-00003',
    title: 'Incorrect grade in Math 101',
    category: 'academic',
    description: 'My final grade was entered as a C, but my portal shows I scored 85%.',
    location: 'N/A',
    priority: 'high',
    status: 'resolved',
    student_id: 'user-2',
    created_at: new Date(Date.now() - 900000000).toISOString(),
    activities: [
      {
        id: 'act-5',
        activity_type: 'created',
        created_at: new Date(Date.now() - 900000000).toISOString(),
      },
      {
        id: 'act-6',
        activity_type: 'status_change',
        old_status: 'submitted',
        new_status: 'resolved',
        created_at: new Date(Date.now() - 800000000).toISOString(),
      }
    ]
  }
];

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (userId, type, title, message, complaintId) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      user_id: userId,
      type,
      title,
      message,
      complaint_id: complaintId,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const addComplaint = (complaintData) => {
    const newComplaint = {
      id: `CMP-${String(complaints.length + 1).padStart(5, '0')}`,
      ...complaintData,
      status: 'submitted',
      created_at: new Date().toISOString(),
      activities: [
        {
          id: `act-${Date.now()}`,
          activity_type: 'created',
          created_at: new Date().toISOString(),
        }
      ]
    };
    setComplaints([newComplaint, ...complaints]);
    return newComplaint;
  };

  const updateComplaintStatus = (id, newStatus, content) => {
    setComplaints(complaints.map(c => {
      if (c.id === id) {
        const activity = {
          id: `act-${Date.now()}`,
          activity_type: 'status_change',
          old_status: c.status,
          new_status: newStatus,
          content,
          created_at: new Date().toISOString(),
        };
        
        // Notify student of status change
        if (c.status !== newStatus) {
           addNotification(
             c.student_id, 
             'status_change', 
             'Complaint Status Updated', 
             `Your complaint ${c.id} has been ${newStatus.replace('_', ' ')}.`,
             c.id
           );
        }

        return {
          ...c,
          status: newStatus,
          activities: [...c.activities, activity].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        };
      }
      return c;
    }));
  };
  
  const addResponse = (id, content) => {
     setComplaints(complaints.map(c => {
      if (c.id === id) {
        const activity = {
          id: `act-${Date.now()}`,
          activity_type: 'response',
          content,
          created_at: new Date().toISOString(),
        };
        
        // Notify student of response
        addNotification(
           c.student_id, 
           'new_response', 
           'New Response Received', 
           `An admin responded to your complaint ${c.id}.`,
           c.id
        );

        return {
          ...c,
          activities: [...c.activities, activity].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        };
      }
      return c;
    }));
  }

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
