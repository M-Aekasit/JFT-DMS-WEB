import api from "./axios";

export const fetchStopReasons = async () => {
  const response = await api.get("/getStopReasons");
  return response.data;
};
