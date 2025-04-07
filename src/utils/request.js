import axios from "axios";

const baseURL = "http://localhost:3000"; // Default base URL

// Create axios instance
const service = axios.create({
  baseURL: baseURL, // Base URL for API requests
  timeout: 10000, // request timeout
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// Request interceptor  
// service.interceptors.request.use(
//   (config) => {
//     // Add authorization token if exists
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     console.error("Request error:", error);
//     return Promise.reject(error);
//   }
// );

// Response interceptor
// service.interceptors.response.use(
//   (response) => {
//     const res = response.data;

//     // If the custom code is not 200, it is judged as an error.
//     if (res.code !== 200) {
//       console.error("Error:", res.message || "Error");

//       // 401: Token expired or not valid;
//       if (res.code === 401) {
//         // Handle token error, e.g. redirect to login
//         // window.location.href = '/login';
//       }
//       return Promise.reject(new Error(res.message || "Error"));
//     } else {
//       return res;
//     }
//   },
//   (error) => {
//     console.error("Response error:", error);
//     return Promise.reject(error);
//   }
// );

export default service;
