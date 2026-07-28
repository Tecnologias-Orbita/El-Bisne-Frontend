export type LoginCredentials = {
  email: string;
  password: string;
};

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  full_name: string;
  is_platform_admin: boolean;
};
