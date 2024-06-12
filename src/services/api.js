import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const getAllTasks = async () => {
  const response = await axios.get(`${API_URL}/api/tasks`, getAuthHeaders());
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await axios.get(`${API_URL}/api/tasks/${id}`, getAuthHeaders());
  return response.data;
};

export const createTask = async (task) => {
  const response = await axios.post(`${API_URL}/api/tasks`, task, getAuthHeaders());
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await axios.put(`${API_URL}/api/tasks/${id}`, task, getAuthHeaders());
  return response.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${API_URL}/api/tasks/${id}`, getAuthHeaders());
};
