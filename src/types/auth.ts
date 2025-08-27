export interface LoginFormData {
  email: string;
}

export interface LoginState {
  isSubmitting: boolean;
  isEmailSent: boolean;
  email: string;
  error: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    emailSent: boolean;
    expiresAt: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
