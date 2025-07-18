// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../utils/axiosInstance'; 

const useAuthStore = create(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      
      // FETCH USER
      // This function fetches the user data from the server on app load
      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get('/user/me', { withCredentials: true });
          set({ user: res.data.user, loading: false });
        } catch (err) {
          set({
            loading: false,
          });
        }
      },

      updateUser: async (data) => {
        set({ loading: true, error: null });
        try {
          const res=await axios.patch('/user/update', data);
          set({ user: res.data.user , loading: false });
        } catch (err) {
          set({ error: err.response?.data?.msg || 'Update failed' });
        }
      },   

      updatePassword: async (oldPassword, newPassword) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.patch('/user/password', { oldPassword, newPassword });
          set({ user: res.data.user, loading: false });
        } catch (err) {
          set({ error: err.response?.data?.msg || 'Password update failed' });
        }
      },
      // LOGIN
      login: async (formData) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post('/user/login', formData);
          set({ user: res.data.user || true, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.msg || 'Login failed',
            loading: false,
          });
        }
      },

      // SIGNUP
      signup: async (formData) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post('/user/signup', formData);
          set({ loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.msg || 'Signup failed',
            loading: false,
          });
        }
      },

      // LOGOUT
      logout: async () => {
        try {
          await axios.post('/user/logout', {},{ withCredentials: true});
          set({ user: null, error: null });
        } catch (err) {
          set({ error: err.response?.data?.msg || 'Logout failed' });
        }
      },
    })
);
export default useAuthStore;