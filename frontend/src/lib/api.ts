import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  signup: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/signup", data),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data: Record<string, unknown>) =>
    api.put("/auth/profile", data),
};

// Emotion Detection API
export const emotionAPI = {
  detectFace: (formData: FormData) =>
    api.post("/detect/face", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    }),
  detectAudio: (formData: FormData) =>
    api.post("/detect/audio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    }),
  detectText: (text: string) =>
    api.post("/detect/text", { text }),
  detectFusion: (data: {
    face_result?: Record<string, unknown>;
    audio_result?: Record<string, unknown>;
    text_result?: Record<string, unknown>;
  }) => api.post("/detect/fusion", data),
};

// Analytics API
export const analyticsAPI = {
  getHistory: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get("/analytics/history", { params }),
  getMoodTrends: (period: string) =>
    api.get(`/analytics/trends/${period}`),
  getWeeklyReport: () => api.get("/analytics/weekly-report"),
  getEmotionDistribution: () => api.get("/analytics/distribution"),
  getInsights: () => api.get("/analytics/insights"),
  exportReport: (format: string) =>
    api.get(`/analytics/export/${format}`, { responseType: "blob" }),
};

// Admin API
export const adminAPI = {
  getUsers: (params?: { page?: number; limit?: number }) =>
    api.get("/admin/users", { params }),
  getUserStats: () => api.get("/admin/stats"),
  getDetectionStats: () => api.get("/admin/detection-stats"),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  updateUserRole: (userId: string, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),
};

export default api;
