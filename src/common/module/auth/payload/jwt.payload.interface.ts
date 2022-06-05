export interface JwtPayload {
  email: string;
  id: string;
  authType?: 'reset';
}
