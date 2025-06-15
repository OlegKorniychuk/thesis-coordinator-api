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

  public async getSupervisorsWithLoad(diplomaCycleId) {
    return await prisma.supervisor.findMany({
      select: {
        supervisor_id: true,
        max_load: true,
        teacher: true,
        _count: {
          select: {
            bachelors: true
          }
        }
      }
    });
  }

  public async getSupervisorWithLoad(supervisorId: string) {
    return await prisma.supervisor.findUniqueOrThrow({
      where: {
        supervisor_id: supervisorId
      },
      include: {
        _count: {
          select: {
            bachelors: true
          }
        }
      }
    });
  }

  public async getSupervisorByUserId(userId: string) {
    return await prisma.supervisor.findUniqueOrThrow({
      where: {
        user_id: userId
      },
      include: {
        teacher: true,
        supervisors_info: true,
        _count: {
          select: {
            bachelors: true
          }
        }
      }
    });
  }

  public async getSupervisorsWithPasswords() {
    return prisma.supervisor.findMany({
      select: {
        teacher: true,
        user: {
          select: {
            password_plain: true,
            login: true
          }
        }
      },
      orderBy: {
        teacher: {
          last_name: 'asc'
        }
      }
    });
  }
}

export default new SupervisorService();
