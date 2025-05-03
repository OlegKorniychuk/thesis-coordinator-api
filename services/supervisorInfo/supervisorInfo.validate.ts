import {z} from 'zod';

const ValidateCreateSupervisorInfo = z.object({
  supervisor_id: z.string().uuid(),
  comment: z.string().nonempty().optional(),
  accept_with_topic_only: z.boolean()
});

const ValidateUpdateSupervisorInfo = z.object({
  comment: z.string().nonempty().optional(),
  accept_with_topic_only: z.boolean().optional()
});

export {ValidateCreateSupervisorInfo, ValidateUpdateSupervisorInfo};
