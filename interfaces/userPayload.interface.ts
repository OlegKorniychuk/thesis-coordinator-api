import {UserRole} from '@prisma/client';

export interface IUserPayload {
  user_id: string;
  role: UserRole;
}
