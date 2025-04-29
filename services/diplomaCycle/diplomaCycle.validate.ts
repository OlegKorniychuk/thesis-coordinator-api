import {z} from 'zod';

const ValidateCreateDiplomaCycle = z
  .object({
    year: z.number().int().min(new Date().getFullYear()).max(2100),
    start_date: z.coerce.date().min(new Date()),
    supervisor_selection_end_date: z.coerce.date().min(new Date()),
    topic_selection_end_date: z.coerce.date().min(new Date())
  })
  .required();

export {ValidateCreateDiplomaCycle};
