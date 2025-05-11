// src/store/adminStore.js
import { create } from 'zustand';
import axios from 'axios';

const useAdminStore = create((set) => ({
  // State
  pendingUsers: [],
  teachers: [],
  classes: [],
  notifications: [],
  fees: [],

  // Actions
  fetchPendingUsers: async () => {
    const { data } = await axios.get('http://localhost:5000/api/admin/pending-users');
    set({ pendingUsers: data });
  },

  approveUser: async (id, approve) => {
    await axios.post(`http://localhost:5000/api/admin/approve-user/${id}`, { approve });
    set((state) => ({
      pendingUsers: state.pendingUsers.filter((u) => u._id !== id),
    }));
  },

  fetchTeachersAndClasses: async () => {
    const [teachersRes, classesRes] = await Promise.all([
      axios.get('/api/admin/teachers'),
      axios.get('/api/admin/classes'),
    ]);
    set({ teachers: teachersRes.data, classes: classesRes.data });
  },

  assignClassesToTeacher: async (teacherId, classIds) => {
    await axios.post(`/api/admin/assign-classes/${teacherId}`, { classIds });
  },

  fetchFees: async () => {
    const { data } = await axios.get('/api/admin/fees');
    set({ fees: data });
  },

  createNotification: async (payload) => {
    await axios.post('/api/admin/notify', payload);
    set((state) => ({
      notifications: [...state.notifications, payload],
    }));
  },

  fetchNotifications: async () => {
    const { data } = await axios.get('/api/admin/notifications');
    set({ notifications: data });
  },
}));

export default useAdminStore;
