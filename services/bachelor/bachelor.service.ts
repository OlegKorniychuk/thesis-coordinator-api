import {IBachelorFullData} from '@interfaces/bachelorFullData.interface';
import {Prisma, Bachelor} from '@prisma/client';
import prisma from 'prisma/prisma';

class SupervisorService {
  public async createBachelor(data: Prisma.BachelorCreateInput): Promise<Bachelor> {
    return await prisma.bachelor.create({data});
  }

  public async getBachelorsFullData(diplomaCycleId: string): Promise<IBachelorFullData[]> {
    return await prisma.bachelor.findMany({
      include: {
        student: true,
        topic: true,
        supervisor: {
          include: {
            teacher: true
          }
        }
      },
      where: {
        user: {
          diploma_cycle: {
            diploma_cycle_id: {
              equals: diplomaCycleId
            }
          }
        }
      }
    });
  }

  public async getBachelorById(id: string): Promise<Bachelor> {
    return await prisma.bachelor.findUniqueOrThrow({
      where: {
        bachelor_id: id
      }
    });
  }

  public async getBachelorsFullDataById(id: string): Promise<IBachelorFullData> {
    return await prisma.bachelor.findUniqueOrThrow({
      include: {
        student: true,
        topic: true,
        supervisor: {
          include: {
            teacher: true
          }
        }
      },
      where: {
        bachelor_id: id
      }
    });
  }

  public async getPaginatedBachelors(page?: number, resultsPerPage?: number) {
    let skip: number = 0;
    let take: number = 10;
    if (page && resultsPerPage) {
      skip = resultsPerPage * (page - 1);
      take = resultsPerPage;
    }

    return await prisma.bachelor.findMany({
      skip,
      take,
      include: {
        student: true
      }
    });
  }

  public async getBachelorsCount(): Promise<number> {
    return await prisma.bachelor.count();
  }
}

export default new SupervisorService();
