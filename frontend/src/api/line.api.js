import api from "./axios";

function unwrapResponse(response) {
  const body = response?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.Data)) return body.Data;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

// (GET)
export const getLines = async () => {
  const response = await api.get("/getLines");
  return response.data;
};

// (POST)
export const addLineApi = async (lineData) => {
  const response = await api.post("/addLine", lineData);
  return response.data;
};

// (PUT)
export const editLineApi = async (code, lineData) => {
  const response = await api.put(`/editLine/${code}`, lineData);
  return response.data;
};

// (DELETE)
export const deleteLineApi = async (code) => {
  const response = await api.delete(`/deleteLine/${code}`);
  return response.data;
};

// (PATCH)
export const patchProductionInfoApi = async (code, data) => {
  const response = await api.patch(`/patchProductionInfo/${code}`, data);
  return response.data;
};

export const patchStopStatusApi = async (code, data) => {
  const response = await api.patch(`/patchStopStatus/${code}`, data);
  return response.data;
};
