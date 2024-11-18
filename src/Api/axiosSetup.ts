/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";
import { refreshAccessToken } from "./auth"; // Function to refresh the token

let isRefreshing = false; // Status to track token refresh
let failedQueue: any[] = []; // Queue for requests that fail due to token expiration

// Process the failed requests queue after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Set up Axios interceptor
export const axiosSetup = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
  
  // Interceptor to handle responses
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 error and retry logic
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as already retried

        const refreshToken = Cookies.get("refreshToken");

        if (!refreshToken) {
          // No refresh token available, redirect to login
          //window.location.href = "/"; // Adjust the URL as needed
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // If another refresh request is ongoing, queue this request
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              // Retry the original request with the new token
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;

        try {
          
          // Refresh the token by calling the refresh endpoint
          const data = await refreshAccessToken();
          console.log('====================================');
          console.log(data);
          console.log('====================================');
          if(data.status === 200){
            
            localStorage.setItem("accessToken", data.data.result.accessToken);

            // Set the new token for future requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.data.result.accessToken}`;
            processQueue(null, data.data.result.accessToken); // Retry queued requests
  
            // Retry the original request with the new token
            originalRequest.headers["Authorization"] = `Bearer ${data.data.result.accessToken}`;
            return axios(originalRequest);
          }
          else{
            localStorage.removeItem("accessToken");
            Cookies.remove('refreshToken');
            return Promise.reject(originalRequest);
          }
          
        } catch (err) {
          // Refresh token failed, clear tokens and redirect to login
          processQueue(err, null);
          localStorage.removeItem("accessToken");
          Cookies.remove("refreshToken");
         
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
