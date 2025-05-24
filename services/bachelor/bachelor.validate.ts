import {z} from 'zod';

const ValidateUpdateBachelor = z.object({
  supervisorId: z.string().uuid().optional(),
  firstName: z.string().min(2).max(30).optional(),
  secondName: z.string().min(2).max(30).optional(),
  lastName: z.string().min(2).max(30).optional(),
  group: z.string().min(5).max(10).optional(),
  specialty: z.string().min(2).max(100).optional(),
  academicProgram: z.string().min(2).max(100).optional()
});

export {ValidateUpdateBachelor};
