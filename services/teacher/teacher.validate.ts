import {z} from 'zod';

const ValidateCreateTeacher = z
  .object({
    first_name: z.string().min(2).max(30),
    second_name: z.string().min(2).max(30),
    last_name: z.string().min(2).max(30),
    academic_degree: z.string().min(1).max(50),
    position: z.string().min(2).max(100)
  })
  .required();

export {ValidateCreateTeacher};
