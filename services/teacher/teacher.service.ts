import {Prisma, Teacher} from '@prisma/client';
import prisma from 'prisma/prisma';

class TeacherService {
  public async createTeacher(data: Prisma.TeacherCreateInput): Promise<Teacher> {
    return await prisma.teacher.create({data: data});
  }

  public async getManyTeachers(options: Prisma.TeacherFindManyArgs): Promise<Teacher[]> {
    return await prisma.teacher.findMany(options);
  }
}

export default new TeacherService();
