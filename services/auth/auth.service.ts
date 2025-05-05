import {Prisma, User, UserRole} from '@prisma/client';
import {randomBytes} from 'crypto';
import bcrypt from 'bcrypt';
import prisma from 'prisma/prisma';
import {IUserPayload} from '@interfaces/userPayload.interface';
import settings from 'settings';
import {SafeUser} from '@interfaces/safeUser.interface';
import jwt from 'jsonwebtoken';

class AuthService {
  private readonly DEFAULT_CHARSET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*_';

  private readonly HASH_ROUNDS = 12;

  private generateSecureString = (length: number): string => {
    const bytes = randomBytes(length);
    const result = new Array(length);
    const charsetLen = this.DEFAULT_CHARSET.length;

    for (let i = 0; i < length; i++) {
      result[i] = this.DEFAULT_CHARSET[bytes[i] % charsetLen];
    }

    return result.join('');
  };

  private getUserData = async (filter: Prisma.UserWhereInput): Promise<User | null> => {
    return await prisma.user.findFirst({where: filter});
  };

  private async hashString(input: string): Promise<string> {
    return await bcrypt.hash(input, this.HASH_ROUNDS);
  }

  private async validateHashedString(plainString: string, hashedString: string): Promise<boolean> {
    return await bcrypt.compare(plainString, hashedString);
  }

  public generateNewUser = async (role: UserRole, diplomaCycleId: string): Promise<User> => {
    let login: string = '';
    let exists = true;

    while (exists) {
      login = this.generateSecureString(12);
      const user = await this.getUserData({login: login});
      if (!user) exists = false;
    }

    const password = this.generateSecureString(10);
    const hashedPassword = await this.hashString(password);
    const newUser = await prisma.user.create({
      data: {
        login: login,
        password_plain: password,
        password_hash: hashedPassword,
        role: role,
        diploma_cycle_id: diplomaCycleId
      }
    });

    return newUser;
  };

  public generateAccessToken(userId: string, userRole: UserRole): string {
    const payload: IUserPayload = {user_id: userId, role: userRole};
    return jwt.sign(payload, settings.accessTokenSecret, {
      expiresIn: settings.accessTokenExpiresIn
    });
  }

  public async generateRefreshToken(userId: string, userRole: UserRole): Promise<string> {
    const payload: IUserPayload = {user_id: userId, role: userRole};
    const refreshToken = jwt.sign(payload, settings.refreshTokenSecret, {
      expiresIn: settings.refreshTokenExpiresIn
    });
    // saving refresh token or replacing if exists
    await prisma.refreshToken.upsert({
      update: {
        token: refreshToken
      },
      create: {
        token: refreshToken,
        user_id: userId
      },
      where: {
        user_id: userId
      }
    });

    return refreshToken;
  }

  public async logIn(login: string, password: string): Promise<SafeUser | null> {
    const user: User | null = await prisma.user.findFirst({
      where: {
        login: login
      }
    });

    if (!user) return null;

    const passwordValid: boolean = await this.validateHashedString(password, user.password_hash);

    if (!passwordValid) return null;

    const {password_plain, password_hash, ...safeUser} = user;
    return safeUser;
  }
}

export default new AuthService();
