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

  public async getBachelorsSupervisionRequest(bachelorId: string): Promise<SupervisionRequest[]> {
    return await prisma.supervisionRequest.findMany({
      where: {
        bachelor_id: bachelorId
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
    comment?: string,
    supervisorsComment?: string
  ): Promise<SupervisionRequest> {
    const updateData: Prisma.SupervisionRequestUpdateInput = {
      status
    };

    if (comment) updateData.comment = comment;
    if (supervisorsComment) updateData.supervisors_comment = supervisorsComment;

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

  public async getSupervisorsSupervisionRequests(supervisorId: string) {
    return await prisma.supervisionRequest.findMany({
      where: {
        supervisor_id: {
          equals: supervisorId
        }
      },
      include: {
        bachelor: {
          include: {
            student: true
          }
        }
      }
    });
  }
}

export default new SupervisionRequestService();
