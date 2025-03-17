import React from "react";
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { authService } from "./authService";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

interface ApiErrorResponse {
  message: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:9090/api",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Šaljem zahtjev na: ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        const status = error.response?.status;

        console.log(
          `Primljena greška ${status} za URL: ${originalRequest?.url}`
        );

        if (
          (status === 401 || status === 403) &&
          originalRequest &&
          !originalRequest._retry
        ) {
          console.log(`Pokušavam osvježiti sesiju zbog ${status} greške...`);
          originalRequest._retry = true;
          try {
            await authService.refreshSession();
            console.log("Sesija uspješno osvježena!");
            return this.api(originalRequest);
          } catch (refreshError) {
            console.error("Neuspješno osvježavanje sesije:", refreshError);
            authService.logout();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(
          new Error(error.response?.data?.message || "Došlo je do greške")
        );
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.api;
  }
}

export const apiService = new ApiService();
export default apiService.getInstance();
