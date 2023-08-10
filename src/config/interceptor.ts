import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Creamos una instancia de axios para configurar nuestro interceptor
const api: AxiosInstance = axios.create({
  baseURL: "https://dev.consultorio-api.lc/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de solicitud
api.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const token = localStorage.getItem("token");
    console.log(token);
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
