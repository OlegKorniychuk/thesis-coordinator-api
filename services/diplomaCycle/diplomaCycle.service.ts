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

  public deleteDiplomaCycle = async (id: string): Promise<DiplomaCycle> => {
    return await prisma.diplomaCycle.delete({
      where: {
        diploma_cycle_id: id
      }
    });
  };
}

export default new DiplomaService();
