import {Prisma, Bachelor} from '@prisma/client';
import prisma from 'prisma/prisma';

class SupervisorService {
  public async createBachelor(data: Prisma.BachelorCreateInput): Promise<Bachelor> {
    return await prisma.bachelor.create({data});
  }
}

export default new SupervisorService();
