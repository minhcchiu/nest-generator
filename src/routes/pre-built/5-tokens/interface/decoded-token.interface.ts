import { TokenPayload } from './token-payload.interface';

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}
