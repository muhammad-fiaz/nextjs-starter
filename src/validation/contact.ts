import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  message: z.string().min(10),
});
