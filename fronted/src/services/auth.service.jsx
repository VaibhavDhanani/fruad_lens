import api from "../utils/db"; // ✅ correctly import the Axios instance

export const loginUser = async (username, password) => {
  const response = await api.post('/users/login', { username, password });
  return response.data;
};

export const registerUser = async (name, username, password) => {
  const response = await api.post('/users/register', { name, username, password });
  return response.data;
};

export const verifyToken = async (token) => {
  const response = await api.get('/verify', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.user;
};
