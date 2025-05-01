import {Prisma, Student, Supervisor, Teacher, Topic} from '@prisma/client';

export interface IBachelorFullData
  extends Prisma.BachelorGetPayload<{
    include: {
      student: true;
      topic: true;
      supervisor: {
        include: {
          teacher: true;
        };
      };
    };
  }> {}
