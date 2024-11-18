export interface JwtPayload {
  name: string;
  email: string;
  uuid: string;
  roles: string[];
  exp: string;
  iat: string;
  nbf: string;
  iss: string;
}
