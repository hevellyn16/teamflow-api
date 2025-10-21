import type { FastifyInstance } from "fastify";
import { ProjectController } from "../controller/ProjectController";
import { authMiddleware, verifyUserRole } from "../middlewares/auth";
import { z } from "zod";
import { ProjectCreateBodySchema } from "../dto/project/ProjectCreateBodySchema";
import { ProjectUpdateBodySchema } from "../dto/project/ProjectUpdateBodySchema";
import { ProjectStatus } from "@prisma/client";
import { start } from "repl";

// Schema para a resposta de um projeto
const ProjectResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
    status: z.enum(ProjectStatus).optional(),
    startDate: z.date().nullable(),
    sectorId: z.uuid(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
    users: z.array(z.object({
        email: z.email(),
    })).optional(),
});

export async function projectRoutes(app: FastifyInstance) {
    const projectController = new ProjectController();

    /** Rotas de Gerenciamento de Projetos (Acesso de Gerente e Diretor) **/
    app.post('/projects', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
        schema: { 
            summary: 'Criar um novo projeto (Gerente/Diretor)',
            description: 'Permite que um Gerente ou Diretor crie novos projetos.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            body: ProjectCreateBodySchema,
            response: { 201: ProjectResponseSchema },
        }
    }, projectController.createProject);

    app.get('/projects', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
        schema: {
            summary: 'Listar todos os projetos (Gerente/Diretor)',
            description: 'Permite que um Gerente ou Diretor veja todos os projetos cadastrados.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            response: { 200: z.array(ProjectResponseSchema) },
        }
    }, projectController.getAllProjects);


    app.get('/projects/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
        schema: {
            summary: 'Obter um projeto por ID (Gerente/Diretor)',
            description: 'Permite que um Gerente ou Diretor veja os detalhes de um projeto específico.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
            }),
            response: { 200: ProjectResponseSchema },
        }
    }, projectController.getProjectById);

    app.put('/projects/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
        schema: {
            summary: 'Atualizar um projeto por ID (Gerente/Diretor)',
            description: 'Permite que um Coordenador ou Diretor atualize os detalhes de um projeto específico.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
            }),
            body: ProjectUpdateBodySchema,
            response: { 200: ProjectResponseSchema },
        }
    }, projectController.updateProject);

    app.delete('/projects/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
        schema: {
            summary: 'Deletar um projeto por ID (Gerente/Diretor)',
            description: 'Permite que um Gerente ou Diretor delete um projeto específico.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
            }),
            response: { 204: z.void() },
        }
    }, projectController.deleteProject);
}
