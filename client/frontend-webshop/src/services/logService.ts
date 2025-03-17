import api from "./api";

// Tipovi za LoginHistory
export interface LoginHistory {
  id: number;
  userEmail: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  timestamp: string;
  ipAddress: string;
}

// Tipovi za RequestLog
export interface RequestLog {
  id: number;
  endpoint: string;
  method: string;
  timestamp: string;
  ipAddress: string;
  userId?: number;
  username?: string;
}

export const getLoginHistory = async (): Promise<LoginHistory[]> => {
  try {
    const response = await api.get<LoginHistory[]>("/history-log");

    return response.data;
  } catch (error) {
    console.error("Error fetching login history:", error);
    throw error;
  }
};

export const getRequestLogs = async (): Promise<RequestLog[]> => {
  try {
    const response = await api.get<RequestLog[]>("/request-log");
    return response.data;
  } catch (error) {
    console.error("Error fetching request logs:", error);
    throw error;
  }
};
