import {z} from 'zod';

const ValidateConfirmTopic = z.object({
  refinedTopic: z.string().min(10).optional()
});

const ValidateCreateTopic = z.object({
  bachelor_id: z.string().uuid(),
  name: z.string().nonempty(),
  comment: z.string().nonempty().optional()
});

const ValidateRejectTopic = z
  .object({
    comment: z.string().nonempty()
  })
  .required();

export {ValidateConfirmTopic, ValidateCreateTopic, ValidateRejectTopic};
