import {ArchivedBachelor, Prisma} from '@prisma/client';
import prisma from 'prisma/prisma';

class ArchivedBachelorService {
  public async createArchivedBachelors(
    data: Prisma.ArchivedBachelorCreateInput[]
  ): Promise<Prisma.BatchPayload> {
    return await prisma.archivedBachelor.createMany({
      data
    });
  }

  public async getUniqueYears(): Promise<{year: number}[]> {
    return await prisma.archivedBachelor.findMany({
      distinct: 'year',
      select: {
        year: true
      }
    });
  }

  public async getArchivedBachelorsByYear(year: number): Promise<ArchivedBachelor[]> {
    return await prisma.archivedBachelor.findMany({
      where: {
        year: {
          equals: year
        }
      }
    });
  }
}

export default new ArchivedBachelorService();
