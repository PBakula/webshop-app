export type UserRoleName = "USER" | "ADMIN";

export interface UserRole {
  id: number;
  name: UserRoleName;
  users: any[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface JwtResponse {
  accessToken: string;
  token: string;
}

export interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface ApiError {
  message: string;
}
