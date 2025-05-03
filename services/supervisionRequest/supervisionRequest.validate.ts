import {z} from 'zod';

const ValidateCreateSupervisionRequest = z.object({
  bachelor_id: z.string().uuid(),
  supervisor_id: z.string().uuid(),
  comment: z.string().nonempty().optional(),
  proposed_topic: z.string().nonempty().optional()
});

const ValidateRejectSupervisionRequest = z
  .object({
    comment: z.string().nonempty()
  })
  .required();

export {ValidateCreateSupervisionRequest, ValidateRejectSupervisionRequest};
