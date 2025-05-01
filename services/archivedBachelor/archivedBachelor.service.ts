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
}

export default new ArchivedBachelorService();
