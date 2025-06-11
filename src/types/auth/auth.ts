export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  roles?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

export interface AuthResponse {
  code: number;
  message: string;
  result: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  code: number;
  message: string;
  result: {
    userId: string;
    accessToken: string;
  };
}

export interface RegisterResponse {
  code: number;
  message: string;
  result: {
    firstName: string;
    lastName: string;
    email: string;
    roles: Array<{
      name: string;
      permissions: Array<{
        name: string;
      }>;
    }>;
  };
}

export interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  jti: string;
  scope: string;
}

export interface UserData {
  email: string;
  permissions: string[];
  tokenExpiry: number;
} 
