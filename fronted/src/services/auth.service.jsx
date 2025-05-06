import api from "../utils/db"; // ✅ correctly import the Axios instance

export const loginUser = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/register', { name, email, password });
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
