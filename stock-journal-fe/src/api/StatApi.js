import api from "./api";

export const getClosedPositions = async () => {
  const token = localStorage.getItem("token");
  return await api.get("/stats/index", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const getDetailClosed = async (id) => {
  const token = localStorage.getItem("token");

  return await api.get(`/stats/detail/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const refreshStats = async () => {
  const token = localStorage.getItem("token");

  return await api.post(
    `/stats/refresh`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
};

export const getStats = async () => {
  const token = localStorage.getItem("token");
  return await api.get(`/stats/show`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

// StatApi.js
export const getGrowthChart = async () => {
  const token = localStorage.getItem("token");
  return await api.get(`/stats/growth`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
