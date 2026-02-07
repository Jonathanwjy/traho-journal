import api from "./api";

export const register = async (data) => {
  return await api.post("/register", data);
};

export const login = async (data) => {
  return await api.post("/login", data);
};

export const logout = async () => {
  const token = localStorage.getItem("token"); // Ambil token aktif
  return await api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`, // Sertakan token agar server mengenali user
      },
    },
  );
};

export const changePassword = async (data) => {
  const token = localStorage.getItem("token"); // Ambil token yang disimpan saat login

  return await api.post("/change-password", data, {
    headers: {
      Authorization: `Bearer ${token}`, // Kirim token ke backend Laravel
      Accept: "application/json",
    },
  });
};

export const getProfile = async () => {
  const token = localStorage.getItem("token"); // Ambil token aktif
  return await api.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`, // Identifikasi user ke Laravel
      Accept: "application/json",
    },
  });
};
