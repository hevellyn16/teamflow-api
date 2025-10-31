import type { FastifyInstance } from "fastify";
import { UserController } from "../controller/UserController";
import { authMiddleware, verifyUserRole } from "../middlewares/auth";
import { z } from "zod";
import { Role } from "@prisma/client";

// Schema para a resposta de um usuário, evitando expor a senha
const UserResponseSchema = z.object({
    id: z.uuid(),
    name: z.string().nullable(),
    email: z.email(),
    role: z.enum(Role),
    isActive: z.boolean(),
});

export async function userRoutes(app: FastifyInstance) {
    const userController = new UserController();

    /** Rota de Autenticação **/
    app.post('/sessions', {
        schema: {
            summary: 'Autenticar um usuário (Login)',
            tags: ['Autenticação'],
            body: z.object({ email: z.string().email(), password: z.string() }),
            response: { 200: z.object({ token: z.string() }) },
        }
    }, userController.authenticate);

    /** Rota do Perfil Pessoal **/
    app.get('/profile', {
        onRequest: [authMiddleware],
        schema: {
            summary: 'Buscar o próprio perfil',
            tags: ['Perfil do Usuário'],
            security: [{ bearerAuth: [] }],
            query: z.object({
                page: z.coerce.number().int().min(0).optional().default(0),
                pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
            }),
            response: { 200: UserResponseSchema }
        }
    }, userController.getProfile);

    app.put('/profile', {
        onRequest: [authMiddleware],
        schema: {
            summary: 'Atualizar o próprio perfil',
            description: 'Permite que um usuário autenticado atualize seu próprio nome e senha.',
            tags: ['Perfil do Usuário'],
            security: [{ bearerAuth: [] }],
            body: z.object({
                name: z.string().optional(),
                password: z.string().min(8).optional(),
            }),
            response: { 200: UserResponseSchema }
        }
    }, userController.updateProfile);

    /** Rotas de Gerenciamento de Usuários (Acesso de Diretor) **/
    app.post('/users', {
       onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Criar um novo usuário (Diretor)',
            description: 'Permite que um Diretor cadastre novos usuários.',
            tags: ['Gerenciamento de Usuários'],
            security: [{ bearerAuth: [] }],
            body: z.object({
                name: z.string(),
                email: z.email(),
                password: z.string().min(8),
                role: z.enum(Role),
            }),
            response: { 201: UserResponseSchema }
        }
    }, userController.createUser);

    app.get('/users', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Listar todos os usuários (Diretor)',
            description: 'Permite que um Diretor liste todas as contas de usuários.',
            tags: ['Gerenciamento de Usuários'],
            security: [{ bearerAuth: [] }],
            query: z.object({
                page: z.coerce.number().int().min(0).optional().default(0),
                pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
            }),
            response: { 200: z.array(UserResponseSchema) }
        }
    }, userController.getAllUsers);

    app.get('/users/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Buscar um usuário por ID (Diretor)',
            tags: ['Gerenciamento de Usuários'],
            security: [{ bearerAuth: [] }],
            params: z.object({ id: z.uuid() }),
            query: z.object({
                page: z.coerce.number().int().min(0).optional().default(0),
                pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
            }),
            response: { 200: UserResponseSchema }
        }
    }, userController.getUserById);

    app.put('/users/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Atualizar um usuário (Diretor)',
            description: 'Permite que um Diretor atualize dados ou desative (soft delete) um usuário.',
            tags: ['Gerenciamento de Usuários'],
            security: [{ bearerAuth: [] }],
            params: z.object({ id: z.uuid() }),
            body: z.object({
                name: z.string().optional(),
                role: z.enum(Role).optional(),
                isActive: z.boolean().optional(),
            }),
            response: { 200: UserResponseSchema }
        }
    }, userController.updateUser);

    app.patch('/users/:id/deactivate', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Desativar um usuário (Diretor)',
            tags: ['Gerenciamento de Usuários'],
            security: [{ bearerAuth: [] }],
            params: z.object({ id: z.uuid() }),
            response: { 204: z.null() }
        }
    }, userController.deactivateUser);
}