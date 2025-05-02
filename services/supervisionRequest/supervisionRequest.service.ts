import {Prisma, SupervisionRequest} from '@prisma/client';
import prisma from 'prisma/prisma';

class SupervisionRequestService {
  public async createSupervisionRequest(
    data: Prisma.SupervisionRequestUncheckedCreateInput
  ): Promise<SupervisionRequest> {
    return await prisma.supervisionRequest.create({data});
  }

  public async getBachelorsSupervisionRequests(bachelorId: string): Promise<SupervisionRequest[]> {
    return await prisma.supervisionRequest.findMany({
      where: {
        bachelor_id: {
          equals: bachelorId
        }
      }
    });
  }

  public async getBachelorsSupervisionRequestsToSupervisor(
    bachelorId: string,
    supervisorId: string
  ): Promise<SupervisionRequest[]> {
    return await prisma.supervisionRequest.findMany({
      where: {
        bachelor_id: {
          equals: bachelorId
        },
        supervisor_id: {
          equals: supervisorId
        }
      }
    });
  }
}

export default new SupervisionRequestService();
