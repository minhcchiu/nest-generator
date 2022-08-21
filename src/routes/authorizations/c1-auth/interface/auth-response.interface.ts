export interface AuthResponse {
  user: any;
  tokens: {
    ac_token: string;
    rf_token: string;
  };
}
