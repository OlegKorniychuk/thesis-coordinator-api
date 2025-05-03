import {z} from 'zod';

const ValidateConfirmTopic = z.object({
  topicId: z.string().uuid(),
  refinedTopic: z.string().min(10).optional()
});

const ValidateCreateTopic = z.object({
  bachelor_id: z.string().uuid(),
  name: z.string().nonempty(),
  comment: z.string().nonempty().optional()
});

export {ValidateConfirmTopic, ValidateCreateTopic};
