import api from "./api";

export const register = async (data) => {
  return await api.post("/register", data);
};

export const login = async (data) => {
  return await api.post("/login", data);
};

export const logout = async () => {
  const token = localStorage.getItem("token");
  return await api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const changePassword = async (data) => {
  const token = localStorage.getItem("token");

  return await api.post("/change-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  return await api.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};
