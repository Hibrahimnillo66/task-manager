import axios from 'axios';

const API_URL = 'https://task-manager-backend-fc9b159cd82e.herokuapp.com/api';
//const API_URL = 'http://localhost:8080';

const getToken = () => {
  return localStorage.getItem('token');
};

export const getAllTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await axios.get(`${API_URL}/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const createTask = async (task) => {
  const response = await axios.post(`${API_URL}/tasks`, task, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, task, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${API_URL}/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};
