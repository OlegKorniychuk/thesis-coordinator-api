import {IBachelorFullData} from '@interfaces/bachelorFullData.interface';
import {Prisma, Bachelor, Supervisor} from '@prisma/client';
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
        student: true,
        topic: true
      }
    });
  }

  public async getAllBachelors() {
    return await prisma.bachelor.findMany({
      include: {
        student: true,
        topic: true
      }
    });
  }

  public async getBachelorsCount(): Promise<number> {
    return await prisma.bachelor.count();
  }

  public async updateBachelor(updateData: {
    bachelorId: string;
    supervisorId?: string;
    firstName?: string;
    secondName?: string;
    lastName?: string;
    group?: string;
    specialty?: string;
    academicProgram?: string;
  }) {
    const {
      bachelorId,
      supervisorId,
      firstName,
      secondName,
      lastName,
      group,
      specialty,
      academicProgram
    } = updateData;

    const studentData: any = {};
    if (firstName) studentData.first_name = firstName;
    if (secondName) studentData.second_name = secondName;
    if (lastName) studentData.last_name = lastName;
    if (group) studentData.group = group;
    if (specialty) studentData.specialty = specialty;
    if (academicProgram) studentData.academic_program = academicProgram;

    const bachelorData: Prisma.BachelorUpdateInput = {};
    if (supervisorId) bachelorData.supervisor = {connect: {supervisor_id: supervisorId}};
    if (Object.keys(studentData).length > 0) {
      bachelorData.student = {
        update: studentData
      };
    }

    return await prisma.bachelor.update({
      where: {
        bachelor_id: bachelorId
      },
      data: bachelorData,
      include: {
        student: true
      }
    });
  }

  public async getBachelorByUserId(userId: string) {
    return await prisma.bachelor.findUniqueOrThrow({
      where: {
        user_id: userId
      },
      include: {
        topic: true,
        student: true,
        supervision_requests: true,
        supervisor: {
          include: {
            teacher: true
          }
        }
      }
    });
  }

  public async getBachelorsBySupervisorId(supervisorId: string) {
    return await prisma.bachelor.findMany({
      where: {
        supervisor_id: {
          equals: supervisorId
        }
      },
      include: {
        student: true,
        topic: true
      }
    });
  }

  public async getBachelorsWithPasswords() {
    return prisma.bachelor.findMany({
      select: {
        student: true,
        user: {
          select: {
            password_plain: true,
            login: true
          }
        }
      },
      orderBy: {
        student: {
          group: 'asc'
        }
      }
    });
  }

  public async getBachelorsWithoutSupervisors(): Promise<Bachelor[]> {
    return prisma.bachelor.findMany({
      where: {
        supervisor_id: {
          equals: null
        }
      }
    });
  }

  public async getBachelorsWithoutTopics() {
    return prisma.bachelor.findMany({
      where: {
        topic: null
      },
      select: {
        bachelor_id: true
      }
    });
  }
}

export default new SupervisorService();
