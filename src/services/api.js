import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Add auth token to requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchUserProfile = async (userId) => {
  const response = await axios.get(`${API_URL}/users/${userId}`);
  return response.data;
};

export const fetchSuggestedProfiles = async () => {
  const response = await axios.get(`${API_URL}/users/suggested`);
  return response.data;
};

export const followUser = async (userId) => {
  const response = await axios.post(`${API_URL}/users/follow/${userId}`);
  return response.data;
};

export const unfollowUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/users/follow/${userId}`);
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await axios.get(`${API_URL}/users/search`, {
    params: { query }
  });
  return response.data;
};

export const fetchUserBooks = async (userId) => {
  const response = await axios.get(`${API_URL}/users/${userId}/books`);
  return response.data;
};

export const getNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications`);
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`);
  return response.data;
}; 