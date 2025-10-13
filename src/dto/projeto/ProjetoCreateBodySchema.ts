import {z} from "zod";

export const ProjectCreateBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  createdAt: z.date().optional().default(new Date()),
  updatedAt: z.date().optional().default(new Date()),
});

export type ProjectCreateBody = z.infer<typeof ProjectCreateBodySchema>;