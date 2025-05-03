import {Prisma, SupervisorsInfo} from '@prisma/client';
import prisma from 'prisma/prisma';

class SupervisorInfoService {
  public async createSupervisorInfo(
    data: Prisma.SupervisorsInfoUncheckedCreateInput
  ): Promise<SupervisorsInfo> {
    return await prisma.supervisorsInfo.create({data});
  }

  public async updateSupervisorInfo(
    supervisorId: string,
    data: Prisma.SupervisorsInfoUncheckedUpdateInput
  ): Promise<SupervisorsInfo> {
    return await prisma.supervisorsInfo.update({
      data,
      where: {
        supervisor_id: supervisorId
      }
    });
  }
}

export default new SupervisorInfoService();
