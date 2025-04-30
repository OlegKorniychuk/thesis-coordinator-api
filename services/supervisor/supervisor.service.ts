import {Prisma, Supervisor} from '@prisma/client';
import prisma from 'prisma/prisma';

class SupervisorService {
  public async createSupervisor(data: Prisma.SupervisorCreateInput): Promise<Supervisor> {
    return await prisma.supervisor.create({data});
  }
}

export default new SupervisorService();
