import {z} from 'zod';

const ValidateCreateSupervisor = z
  .object({
    teacherId: z.string().uuid(),
    maxLoad: z.number().positive()
  })
  .required();

const ValidateUpdateSupervisorMaxLoad = z
  .object({
    maxLoad: z.number().positive(),
    supervisorId: z.string().uuid()
  })
  .required();

export {ValidateCreateSupervisor, ValidateUpdateSupervisorMaxLoad};
