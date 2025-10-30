import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User endpoints
export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.patch(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Event endpoints
export const getEvents = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/events${queryString ? `?${queryString}` : ''}`);
};
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (eventData) => api.post('/events', eventData);
export const updateEvent = (id, eventData) => api.patch(`/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Registration endpoints
export const getRegistrations = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/registrations${queryString ? `?${queryString}` : ''}`);
};
export const getRegistration = (id) => api.get(`/registrations/${id}`);
export const createRegistration = (registrationData) => api.post('/registrations', registrationData);
export const deleteRegistration = (id) => api.delete(`/registrations/${id}`);

export default api;

