import {Prisma, Teacher} from '@prisma/client';
import prisma from 'prisma/prisma';

class TeacherService {
  public async createTeacher(data: Prisma.TeacherCreateInput): Promise<Teacher> {
    return await prisma.teacher.create({data: data});
  }

  public async getPaginatedTeachers(page: number, resultsPerPage: number): Promise<Teacher[]> {
    let skip: number = 0;
    let take: number = 10;
    if (page && resultsPerPage) {
      skip = resultsPerPage * (page - 1);
      take = resultsPerPage;
    }

    return await prisma.teacher.findMany({skip, take});
  }
}

export default new TeacherService();
