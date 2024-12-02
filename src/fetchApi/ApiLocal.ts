/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = "http://localhost:8888/api/v1";

const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken"); // Hoặc cách bạn lưu accessToken
};

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hàm gọi API với kiểm tra accessToken
const callApi = async (apiCall: () => Promise<any>) => {
  const token = getAccessToken();
  if (!token) {
    console.warn("No access token available");
    return null;
  }
  try {
    return await apiCall();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const updateProfile = (id: string, data: { firstName: string; lastName: string }) =>
  callApi(() => apiClient.put(`/profile/users/profiles/${id}`, data));

export const changePassword = (data: { oldPassword: string; newPassword: string }) =>
  callApi(() => apiClient.put("/identity/auth/change-password", data));
