import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Creamos una instancia de axios para configurar nuestro interceptor
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",
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
    return error.response;
  }
);

export default api;
