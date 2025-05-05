import {z} from 'zod';

const ValidateLogIn = z
  .object({
    login: z.string().nonempty(),
    password: z.string().nonempty()
  })
  .required();

export {ValidateLogIn};
