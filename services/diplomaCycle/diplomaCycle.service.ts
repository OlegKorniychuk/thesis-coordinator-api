import {DiplomaCycle, Prisma} from '@prisma/client';
import prisma from 'prisma/prisma';

class DiplomaService {
  public getCurrentDiplomaCycle = async (): Promise<DiplomaCycle | null> => {
    return await prisma.diplomaCycle.findFirst({
      where: {
        is_active: {
          equals: true
        }
      }
    });
  };

  public createDiplomaCycle = async (
    data: Prisma.DiplomaCycleCreateInput
  ): Promise<DiplomaCycle> => {
    return await prisma.diplomaCycle.create({data: data});
  };
}

export default new DiplomaService();
