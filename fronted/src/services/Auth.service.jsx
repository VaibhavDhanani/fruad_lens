import api from "../utils/db";
export const loginUser = async (username, mpin) => {
  const response = await api.post("/users/login", { username, mpin });
  return response.data;
};

export const registerUser = async (name, username, mpin, gender, pan_card) => {
  const response = await api.post("/users/register", {
    full_name: name,
    username,
    mpin,
    gender,
    pan_card
  });
  return response.data;
};

export const verifyToken = async (token) => {
  const response = await api.get("/verify", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response)
  return response.data.user;
};

export const getUserInfo = async (token) => {
  try {
    const res = await api.get(`/users/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { ok: true, data: res.data };
  } catch (error) {
    console.error("User fetch error:", error);
    return {
      ok: false,
      data: error.response?.data || { message: "User fetch failed" },
    };
  }
};
