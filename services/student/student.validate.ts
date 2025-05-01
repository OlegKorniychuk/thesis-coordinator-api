import {z} from 'zod';

const ValidateCreateStudent = z
  .object({
    first_name: z.string().min(2).max(30),
    second_name: z.string().min(2).max(30),
    last_name: z.string().min(2).max(30),
    group: z.string().min(5).max(10),
    specialty: z.string().min(2).max(100),
    academic_program: z.string().min(2).max(100)
  })
  .required();

export {ValidateCreateStudent};
