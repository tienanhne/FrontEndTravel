/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios, { AxiosResponse } from "axios";
// import Cookies from "js-cookie";
// import { LoginInput, LoginResponse } from "../redux/type";

export const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// export const login = async (
//   loginInput: LoginInput
// ): Promise<LoginResponse["result"]> => {
//   try {
//     const response = await axios.post<LoginResponse>(
//       "http://localhost:8888/api/v1/identity/auth/login",
//       loginInput,
//       { headers }
//     );

//     if (response.data.code === 0) {
//       return response.data.result;
//     } else {
//       throw new Error(response.data.message);
//     }
//   } catch (error: any) {
//     // Improve error handling
//     throw new Error(error.response?.data?.message || "Login failed");
//   }
// };


// export const refreshAccessToken = async ():  Promise<AxiosResponse<LoginResponse, any>> => {
//   const refreshToken = Cookies.get("refreshToken");
//   if (!refreshToken) {
//     throw new Error("No refresh token available");
//   }
//   console.log('====================================');
//   console.log(refreshToken);
//   console.log('====================================');
//   try {
//     const response = await axios.post<LoginResponse>(
//       "http://localhost:8888/api/v1/identity/auth/refresh-token",
//       { token: refreshToken }
//     );

//     return response;
//   } catch (error: any) {
//     // Improve error handling
//     throw new Error(error.response?.data?.message || "Token refresh failed");
//   }
// };


/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { LoginInput, LoginResponse } from "../redux/type";

// Tạo một instance của Axios
export const apiClient = axios.create({
  baseURL: "http://localhost:8888/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Hàm refresh token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  try {
    const response = await axios.post<LoginResponse>(
      "/identity/auth/refresh-token",
      { token: refreshToken }
    );

    if (response.data.code === 0) {
      const newAccessToken = response.data.result.accessToken;
      Cookies.set("accessToken", newAccessToken); // Lưu lại accessToken mới
      return newAccessToken;
    } else {
      console.error("Refresh token failed:", response.data.message);
      return null;
    }
  } catch (error: any) {
    console.error("Error refreshing token:", error.response?.data?.message || error.message);
    return null;
  }
};

// Axios Interceptor để xử lý lỗi 401
apiClient.interceptors.response.use(
  (response) => response, // Trả về response nếu thành công
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (!originalRequest._retry) {
        originalRequest._retry = true; // Đánh dấu để tránh lặp vô tận

        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          return apiClient(originalRequest); // Thử gửi lại request với token mới
        }
      }
    }

    return Promise.reject(error);
  }
);


export const login = async (loginInput: LoginInput): Promise<LoginResponse["result"]> => {
  try {
    const response = await apiClient.post<LoginResponse>("/identity/auth/login", loginInput);
    if (response.data.code === 0) {
      Cookies.set("accessToken", response.data.result.accessToken);
      Cookies.set("refreshToken", response.data.result.refreshToken);
      return response.data.result;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Xuất Axios instance để dùng trong toàn bộ app
export default apiClient;

