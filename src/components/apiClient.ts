import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  // process.env.NODE_ENV === "production"
  //   ? import.meta.env?.VITE_BACKEND_PRODUCTION_URL
  //   : import.meta.env?.VITE_BACKEND_DEVELOPMENT_URL,
  withCredentials: true, // Automatically send cookies with requests
});

export default apiClient;
