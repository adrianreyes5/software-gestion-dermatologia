import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Creamos una instancia de axios para configurar nuestro interceptor
const api: AxiosInstance = axios.create({
  // Configuración de tu API, como la URL base, encabezados, etc.
  baseURL: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para manejar errores de Axios
const handleAxiosError = (error: AxiosError) => {
  throw error;
};

// Interceptor de solicitud
api.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;
