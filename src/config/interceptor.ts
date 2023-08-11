import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { deleteCookie } from "cookies-next";

// Creamos una instancia de axios para configurar nuestro interceptor
const api: AxiosInstance = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://dev.consultorio-api.lc/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de solicitud
api.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => {
    return error;
  }
);

// Interceptor de respuesta
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if(error.response?.status === 401) {
      localStorage.clear();
      deleteCookie("token");
    }

    return error.response;
  }
);

export default api;
