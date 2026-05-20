import api from "./axios";

export const fetchStopReasons = async () => {
  const response = await api.get("/getStopReasons");
  return response.data;
};

export const addStopReasonApi = async (data) => {
  const response = await api.post("/addStopReason", data);
  return response.data;
};

export const editStopReasonApi = async (code, data) => {
  const response = await api.put(`/editStopReason/${code}`, data);
  return response.data;
};

export const deleteStopReasonApi = async (code) => {
  const response = await api.delete(`/deleteStopReason/${code}`);
  return response.data;
};
