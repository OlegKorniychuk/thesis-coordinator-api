import {Prisma, User, UserRole} from '@prisma/client';
import {randomBytes} from 'crypto';
import prisma from 'prisma/prisma';

class AuthService {
  private readonly DEFAULT_CHARSET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*_';

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

  public generateNewUser = async (role: UserRole, diplomaCycleId: string): Promise<User> => {
    let login: string = '';
    let exists = true;

    while (exists) {
      login = this.generateSecureString(12);
      const user = await this.getUserData({login: login});
      if (!user) exists = false;
    }

    const password = this.generateSecureString(10);
    const newUser = await prisma.user.create({
      data: {
        login: login,
        password_plain: password,
        password_hash: password,
        role: role,
        diploma_cycle_id: diplomaCycleId
      }
    });

    return newUser;
  };
}

export default new AuthService();
