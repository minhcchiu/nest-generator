export interface JwtConfig {
  secret: string;
  expiresIn: string;
  expirationTime: {
    accessToken: string;
    refreshToken: string;
    signupToken: string;
    resetPasswordToken: string;
  };
  secrets: {
    accessToken: string;
    refreshToken: string;
    signupToken: string;
  };
}
