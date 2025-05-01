import {Prisma, Student} from '@prisma/client';
import prisma from 'prisma/prisma';

class StudentService {
  public async createStudent(data: Prisma.StudentCreateInput): Promise<Student> {
    return await prisma.student.create({data: data});
  }

  public async getPaginatedStudents(page: number, resultsPerPage: number): Promise<Student[]> {
    let skip: number = 0;
    let take: number = 10;
    if (page && resultsPerPage) {
      skip = resultsPerPage * (page - 1);
      take = resultsPerPage;
    }

    return await prisma.student.findMany({skip, take});
  }

  public async getStudentById(id: string): Promise<Student | null> {
    return await prisma.student.findUnique({
      where: {
        student_id: id
      }
    });
  }
}

export default new StudentService();
