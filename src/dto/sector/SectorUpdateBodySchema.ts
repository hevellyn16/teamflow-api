import {z} from "zod";
import { is } from "zod/v4/locales";

export const SectorUpdateBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional().default(false),
});

export type SectorUpdateBody = z.infer<typeof SectorUpdateBodySchema>;