import {z} from 'zod';

const ValidateArchivedBachelorsBatchInput = z
  .object({
    year: z.number(),
    full_name: z.string().nonempty(),
    group: z.string().nonempty(),
    topic: z.string().nonempty(),
    specialty: z.string().nonempty(),
    academic_program: z.string().nonempty(),
    supervisor_full_name: z.string().nonempty(),
    supervisor_degree: z.string().nonempty(),
    supervisor_position: z.string().nonempty()
  })
  .required()
  .array();

export {ValidateArchivedBachelorsBatchInput};
