import {z} from "zod";

export const SectorUpdateBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type SectorUpdateBody = z.infer<typeof SectorUpdateBodySchema>;