import { z } from "zod";

export const ProjectUpdateBodySchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
    updatedAt: z.date().default(new Date()),
    ProjectStatus: z.string().min(1, "Project status is required").optional(),
    sector: z.uuid("Sector ID must be a valid UUID").optional(),
    users: z.array(z.email()).optional(),
});

export type ProjectUpdateBody = z.infer<typeof ProjectUpdateBodySchema>;