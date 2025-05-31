/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";
import { refreshAccessToken } from "./auth";

let isRefreshing = false; // Đánh dấu trạng thái refresh token
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = []; // Hàng đợi các yêu cầu thất bại

// Hàm xử lý hàng đợi các yêu cầu đang chờ
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    token ? resolve(token) : reject(error);
  });
  failedQueue = [];
};

// Hàm thiết lập token mặc định cho axios
const setAuthorizationHeader = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Cấu hình interceptor cho axios
export const axiosSetup = () => {
  const accessToken = localStorage.getItem("accessToken");
  setAuthorizationHeader(accessToken);

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Nếu lỗi là 401 và yêu cầu chưa được thử lại
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          // Nếu không có refreshToken, chuyển hướng đến đăng nhập
          localStorage.removeItem("accessToken");
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // Nếu refresh token đang được làm mới, đẩy request vào hàng đợi
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          const response = await refreshAccessToken();
          if (response.status === 200) {
            const newAccessToken = response.data.result.accessToken;

            // Lưu token mới
            localStorage.setItem("accessToken", newAccessToken);
            setAuthorizationHeader(newAccessToken);
            processQueue(null, newAccessToken);

            // Thử lại request ban đầu với token mới
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } else {
            throw new Error("Refresh token không hợp lệ");
          }
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem("accessToken");
          Cookies.remove("refreshToken");
          window.location.href = "/login"; // Điều chỉnh URL nếu cần
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
