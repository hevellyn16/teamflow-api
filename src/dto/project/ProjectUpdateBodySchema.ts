import { z } from "zod";

export const ProjectUpdateBodySchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().default(new Date()),
  ProjectStatus: z.enum(['PLANEJAMENTO', 'EM_ANDAMENTO', 'PAUSADO', 'CONCLUIDO']).optional(),
  sector: z.uuid("Sector ID must be a valid UUID").optional(),
  users: z.array(z.email("User email must be a valid email")).optional(),
  startDate: z.coerce.date().optional(),
});

export type ProjectUpdateBody = z.infer<typeof ProjectUpdateBodySchema>;