export type UserProvider = 'local' | 'google' | 'github';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  provider: UserProvider;
  providerId?: string;
  accessToken?: string; // OAuth 액세스 토큰
  refreshToken?: string; // OAuth 리프레시 토큰
  isEmailVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
