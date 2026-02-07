import api from "./api";

export const getStocks = async () => {
  const token = localStorage.getItem("token");
  return await api.get("/stocks/index", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const addStock = async (data) => {
  const token = localStorage.getItem("token");
  return await api.post("/stocks/store", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const updateStock = async (id, data) => {
  const token = localStorage.getItem("token");
  return await api.patch(`/stocks/${id}/update`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const getStockDetail = async (id) => {
  const token = localStorage.getItem("token");
  return await api.get(`/stocks/${id}/show`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const closePosition = async (id, data) => {
  const token = localStorage.getItem("token");
  return await api.post(`/stocks/${id}/close`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};
