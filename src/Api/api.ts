// import axios, { ResponseType } from "axios";
// import { env } from "./env";

// export default function requestApi<T>(
//   endpoint: string,
//   method: string,
//   body?: T,
//   isRedirect = false,
//   responseType: ResponseType = "json",
//   header?: { "Content-type": string }
// ) {
//   const url = env.VITE_BASE_URL_FONTEND;
//   const api: string = env.VITE_BASE_API;
//   let headers = {
//     Accept: "application/json",
//     "Content-type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Credentials": "true",
//   };
//   if (header) {
//     headers = {
//       ...headers,
//       ...header,
//     };
//   }
//   const instance = axios.create({ headers });
//   // check endpoint api
//   if (
//     endpoint !== "/login" &&
//     endpoint !== "/register" &&
//     !endpoint.includes("/refresh-token")
//   ) {
//     // add token when call request api
//     instance.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem("accessToken");
//         if (!token && isRedirect) {
//           const url = window.location.pathname;
//           const param = encodeURIComponent(url);
//           window.location.href =
//             env.VITE_BASE_URL_FONTEND + `/auth/login?success_page=${param}`;
//         }
//         console.log("token" + token);
//         if (token) {
//           config.headers["Authorization"] = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => {
//         return Promise.reject(error);
//       }
//     );
//     // handle response when token expired
//     instance.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalConfig = error.config;
//         console.log(error);
//         console.log(error.response.status === 401);
//         // if (error.response.status === 401) {
//         //   try {
//         //     const refeshToken = getCookieValue("refreshToken");
//         //     console.log('====================================');
//         //     console.log(refeshToken);
//         //     console.log('====================================');
//         //     const data = {
//         //       refreshToken: refeshToken,
//         //     };
//         //     if (refeshToken && isRedirect) {
//         //       window.location.href = "/";
//         //     }
//         //     const response = await fetch(`http://localhost:8888/api/v1/identity/auth/refresh-token`, {
//         //       method: "POST",
//         //       body: JSON.stringify(data),
//         //       headers: {
//         //         Accept: "application/json",
//         //         "Content-type": "application/json",
//         //         "Access-Control-Allow-Origin": "*",
//         //         "Access-Control-Allow-Credentials": "true",
//         //       }
//         //     });
//         //     console.log('====================================');
//         //     console.log(response);
//         //     console.log('====================================');
            
//         //     return instance(originalConfig);
//         //   } catch (error) {
//         //     console.log(error);
//         //     localStorage.removeItem("accessToken");
            
//         //     return Promise.reject(error);
//         //   }
//         //   return Promise.reject(error);
//         // }
//         return Promise.reject(error);
//       }
//     );
//   }

//   return instance.request({
//     method,
//     url: `${endpoint}`,
//     data: body,
//     responseType,
//   });
// }
// export type Token = {
//   accessToken: string | null;
//   refreshToken: string | null;
// };
// export const setToken = (token: Token) => {
//   token.accessToken &&
//     localStorage.setItem("accessToken", token.accessToken);
//   document.cookie = `refreshToken=${token.refreshToken};expires;path=/`;
// };

// export function getCookieValue(key: string) {
//   // Tách chuỗi cookie thành mảng các cặp key-value
//   const cookies = document.cookie.split(";");
//   console.log(cookies);
//   // Duyệt qua mảng cookies
//   for (let i = 0; i < cookies.length; i++) {
//     // Tách từng cặp key-value
//     const cookie = cookies[i].split("=");

//     // Lấy key và value
//     const cookieKey = cookie[0].trim();
//     const cookieValue = cookie[1];

//     // Kiểm tra xem key có trùng với key mong muốn không
//     if (cookieKey === key) {
//       // Trả về giá trị tương ứng với key
//       return cookieValue;
//     }
//   }

//   // Trả về undefined nếu không tìm thấy key
//   return undefined;
// }
// export function deleteToken() {
//   localStorage.removeItem("access_token");
//   deleteCookie("refresh_token");
// }
// function deleteCookie(name: string) {
//   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
// }
// export const methodPost = async <T>(endpoint: string, data: T) => {
//   const headers = {
//     Accept: "application/json",
//     "Content-type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//   };
//   const config = {
//     headers,
//   };
//   const response = await axios.post(
//     `${env.VITE_BASE_API}${endpoint}`,
//     JSON.stringify(data),
//     config
//   );
//   return response;
// };
// export async function updateMethod<T>(url: string, value: T) {
//   try {
//     const response = await requestApi(url, "PUT", value);
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// }
// export async function postMethod<T>(url: string, value: T) {
//   try {
//     const response = await requestApi(url, "POST", value);
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// }
// export async function deleteMethod<T>(url: string, value: T) {
//   try {
//     const response = await requestApi(url, "DELETE", value);
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// }
