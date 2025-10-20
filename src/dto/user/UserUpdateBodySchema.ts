import z from "zod";

export const UserUpdateBodySchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters long").optional(),
  avatar: z.url("Invalid avatar URL").optional(),
  role: z.enum(['DIRETOR', 'COORDENADOR', 'MEMBRO']).optional(),
});

export type UserUpdateBody = z.infer<typeof UserUpdateBodySchema>;