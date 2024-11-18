/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { LoginInput, LoginResponse } from "../redux/type";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const login = async (
  loginInput: LoginInput
): Promise<LoginResponse["result"]> => {
  try {
    const response = await axios.post<LoginResponse>(
      "http://localhost:8888/api/v1/identity/auth/login",
      loginInput,
      { headers }
    );

    if (response.data.code === 0) {
      return response.data.result;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    // Improve error handling
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


export const refreshAccessToken = async ():  Promise<AxiosResponse<LoginResponse, any>> => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  console.log('====================================');
  console.log(refreshToken);
  console.log('====================================');
  try {
    const response = await axios.post<LoginResponse>(
      "http://localhost:8888/api/v1/identity/auth/refresh-token",
      { token: refreshToken }
    );

    return response;
  } catch (error: any) {
    // Improve error handling
    throw new Error(error.response?.data?.message || "Token refresh failed");
  }
};
