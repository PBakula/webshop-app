import api from "./api";
import { LoginData, RegisterData, UserInfo } from "../types/auth";

class AuthService {
  private readonly USER_INFO_KEY = "userInfo";
  private readonly USER_CART_KEY = "cart_items";

  async login(data: LoginData): Promise<UserInfo> {
    try {
      const response = await api.post<UserInfo>("/login", data);
      this.setUserInfo(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Neuspješna prijava");
    }
  }

  async register(data: RegisterData): Promise<void> {
    try {
      await api.post("/register", data);
    } catch (error) {
      throw new Error("Neuspješna registracija");
    }
  }

  async refreshSession(): Promise<UserInfo> {
    try {
      const response = await api.post<UserInfo>("/refreshToken");
      this.setUserInfo(response.data);
      return response.data;
    } catch (error) {
      this.clearUserData();
      throw new Error("Sesija je istekla");
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Greška prilikom odjave:", error);
    } finally {
      this.clearUserData();
    }
  }

  private setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }

  getUserInfo(): UserInfo | null {
    const userInfoString = localStorage.getItem(this.USER_INFO_KEY);
    if (!userInfoString) return null;

    try {
      return JSON.parse(userInfoString) as UserInfo;
    } catch {
      return null;
    }
  }

  private clearUserData(): void {
    localStorage.removeItem(this.USER_INFO_KEY);
    localStorage.removeItem(this.USER_CART_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getUserInfo();
  }

  hasRole(role: string): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.role?.name === role;
  }

  isAdmin(): boolean {
    return this.hasRole("ADMIN");
  }
}

export const authService = new AuthService();
