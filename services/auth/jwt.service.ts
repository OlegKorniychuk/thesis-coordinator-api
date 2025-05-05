import {IUserPayload} from '@interfaces/userPayload.interface';
import jwt from 'jsonwebtoken';
import ms from 'ms';

class JwtService {
  public createJwt(payload: IUserPayload, secret: string, expiresIn: ms.StringValue): string {
    return jwt.sign(payload, secret, {expiresIn: expiresIn});
  }

  public verifyJwt(token: string, secret: string) {
    return jwt.verify(token, secret);
  }
}

export default new JwtService();
