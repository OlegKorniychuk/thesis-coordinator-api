import {Prisma, SupervisionRequest, SupervisionRequestStatus, Supervisor} from '@prisma/client';
import {equal} from 'assert';
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

  public async getBachelorsSupervisionRequestToSupervisor(
    bachelorId: string,
    supervisorId: string
  ): Promise<SupervisionRequest | null> {
    return await prisma.supervisionRequest.findUnique({
      where: {
        bachelor_id_supervisor_id: {
          bachelor_id: bachelorId,
          supervisor_id: supervisorId
        }
      }
    });
  }

  public async deleteSupervisionRequest(id: string): Promise<SupervisionRequest> {
    return await prisma.supervisionRequest.delete({
      where: {
        supervision_request_id: id
      }
    });
  }

  public async updateSupervisionRequestStatus(
    id: string,
    status: SupervisionRequestStatus,
    comment?: string
  ): Promise<SupervisionRequest> {
    const updateData: Prisma.SupervisionRequestUpdateInput = {
      status
    };

    if (comment) updateData.comment = comment;

    return await prisma.supervisionRequest.update({
      data: updateData,
      where: {
        supervision_request_id: id
      }
    });
  }

  public async deleteSupervisionRequestsOnAccepting(
    id: string,
    bachelorId: string
  ): Promise<Prisma.BatchPayload> {
    return await prisma.supervisionRequest.deleteMany({
      where: {
        supervision_request_id: {
          not: id
        },
        bachelor_id: bachelorId
      }
    });
  }

  public async getSupervisionRequestById(id: string): Promise<SupervisionRequest> {
    return await prisma.supervisionRequest.findUniqueOrThrow({
      where: {
        supervision_request_id: id
      }
    });
  }
}

export default new SupervisionRequestService();
