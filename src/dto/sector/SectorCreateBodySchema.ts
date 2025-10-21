import {z} from "zod";

export const SectorCreateBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type SectorCreateBody = z.infer<typeof SectorCreateBodySchema>;