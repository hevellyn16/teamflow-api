import {object, z} from "zod";

export const ProjectCreateBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  createdAt: z.date().optional().default(new Date()),
  updatedAt: z.date().optional().default(new Date()),
  ProjectStatus: z.enum(['PLANEJAMENTO', 'EM_ANDAMENTO', 'PAUSADO', 'CONCLUIDO']).optional().default('PLANEJAMENTO'),
  sector: z.uuid("Sector ID must be a valid UUID"),
  users: z.array(z.uuid("User ID must be a valid UUID")).optional(),
  startDate: z.coerce.date().optional(),
  objective: z.string().optional(),
});

export type ProjectCreateBody = z.infer<typeof ProjectCreateBodySchema>;