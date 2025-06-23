import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/tasks";

export const getTasks = () =>
  axios.get(`${BASE_URL}/get-all-tasks`, { withCredentials: true });

export const createTask = (data) =>
  axios.post(`${BASE_URL}/create-task`, data, { withCredentials: true });

export const updateTask = (id, data) =>
  axios.put(`${BASE_URL}/update-task/${id}`, data, { withCredentials: true });

export const deleteTask = (id) =>
  axios.delete(`${BASE_URL}/delete-task/${id}`, { withCredentials: true });
