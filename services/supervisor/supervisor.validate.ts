import {z} from 'zod';

const ValidateCreateSupervisor = z
  .object({
    teacherId: z.string().uuid(),
    maxLoad: z.number().positive()
  })
  .required();

export {ValidateCreateSupervisor};
