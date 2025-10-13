import z from "zod";    

export const UserCreateBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  avatar: z.url("Invalid avatar URL").optional(),
  role: z.enum(['DIRETOR', 'COORDENADOR', 'MEMBRO']).default('MEMBRO'),
});

export type UserCreateBody = z.infer<typeof UserCreateBodySchema>;