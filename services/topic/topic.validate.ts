import {z} from 'zod';

const ValidateConfirmTopic = z.object({
  topicId: z.string().uuid(),
  refinedTopic: z.string().min(10).optional()
});

export {ValidateConfirmTopic};
