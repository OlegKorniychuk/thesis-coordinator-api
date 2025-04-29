import {UUID} from 'crypto';
import {User, UserRole} from '@prisma/client';
import prisma from 'prisma/prisma';

class UserService {
  public generateNewUser = async (role: UserRole, diplomaCycleId: UUID): Promise<User> => {
    const login = 'generatedLogin';
    const password = 'generatedPassword';
    const newUser = await prisma.user.create({
      data: {login: login, password: password, role: role, diploma_cycle_id: diplomaCycleId}
    });

    return newUser;
  };
}

export default new UserService();
