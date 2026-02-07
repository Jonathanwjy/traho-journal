import api from "./api";

export const getNotes = async (stockId) => {
  const token = localStorage.getItem("token");

  return await api.get(`/stocks/${stockId}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const addNote = async (stockId, data) => {
  const token = localStorage.getItem("token");

  return await api.post(`/stocks/${stockId}/notes`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const updateNote = async (id, data) => {
  const token = localStorage.getItem("token");

  return await api.patch(`/notes/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};
