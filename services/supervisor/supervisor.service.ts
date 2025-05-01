import {Prisma, Supervisor} from '@prisma/client';
import prisma from 'prisma/prisma';

class SupervisorService {
  public async createSupervisor(data: Prisma.SupervisorCreateInput): Promise<Supervisor> {
    return await prisma.supervisor.create({data});
  }

  public async changeSupervisorMaxLoad(maxLoad: number, id: string): Promise<Supervisor> {
    return await prisma.supervisor.update({where: {supervisor_id: id}, data: {max_load: maxLoad}});
  }

  public async countSupervisorsBachelors(id: string): Promise<number> {
    const res = await prisma.supervisor.findUniqueOrThrow({
      select: {
        _count: {
          select: {bachelors: true}
        }
      },
      where: {
        supervisor_id: id
      }
    });

    return res._count.bachelors;
  }
}

export default new SupervisorService();
