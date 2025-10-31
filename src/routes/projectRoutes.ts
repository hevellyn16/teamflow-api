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
        id: z.uuid(),
    })).optional(),
    objective: z.string().nullable().optional(),
});

export async function projectRoutes(app: FastifyInstance) {
    const projectController = new ProjectController();

    /** Rotas de Gerenciamento de Projetos (Acesso de Gerente e Diretor) **/
    app.post('/projects', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: { 
            summary: 'Criar um novo projeto (Diretor/Coordenador)',
            description: 'Permite que um Diretor ou Coordenador crie novos projetos.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            body: ProjectCreateBodySchema,
            response: { 201: ProjectResponseSchema },
        }
    }, projectController.createProject);

    app.get('/projects', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
        schema: {
            summary: 'Listar todos os projetos (Diretor/Coordenador)',
            description: 'Permite que um Diretor ou Coordenador veja todos os projetos cadastrados.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            query: z.object({
                page: z.coerce.number().int().min(0).optional().default(0),
                pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
            }),
            response: { 200: z.array(ProjectResponseSchema) },
        }
    }, projectController.getAllProjects);


    app.get('/projects/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
        schema: {
            summary: 'Obter um projeto por ID (Diretor/Coordenador)',
            description: 'Permite que um Diretor ou Coordenador veja os detalhes de um projeto específico.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
                page: z.coerce.number().int().min(0).optional().default(0),
                pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
            }),
            response: { 200: ProjectResponseSchema },
        }
    }, projectController.getProjectById);

    app.put('/projects/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
        schema: {
            summary: 'Atualizar um projeto por ID (Diretor/Coordenador)',
            description: 'Permite que um Diretor ou Coordenador atualize os detalhes de um projeto específico.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
            }),
            body: ProjectUpdateBodySchema,
            response: { 200: ProjectResponseSchema },
        }
    }, projectController.updateProject);

    app.put('/projects/deact/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
        schema: {
            summary: 'Desativar um projeto por ID (Diretor/Coordenador)',
            description: 'Permite que um Diretor ou Coordenador desative um projeto específico.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
            }),
            response: { 204: z.void() },
        }
    }, projectController.deactivateProject);

    app.delete(
        '/projects/:id/members/:userId', 
        {
            onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
            schema: {
                summary: 'Remover um membro de um projeto',
                description: 'Permite que Diretores ou Coordenadores de projeto removam um usuário de um projeto específico.',
                tags: ['Projetos'],
                security: [{ bearerAuth: [] }],
                params: z.object({
                    id: z.string().uuid("ID do projeto inválido."),
                    userId: z.string().uuid("ID do usuário a ser removido inválido."),
                }),
                response: {
                    200: ProjectResponseSchema,
                    403: Error, 
                    404: Error, 
                }
            }
        },
        projectController.removeMember
    );

    app.delete('/projects/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR') || verifyUserRole('COORDENADOR')],
        schema: {
            summary: 'Remover um projeto por ID (Diretor/Coordenador)',
            description: 'Permite que um Diretor ou Coordenador remova um projeto específico.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
            }),
            response: { 204: z.void() },
        }
    }, projectController.deleteProject);

    /* Rotas de usuários */
    app.get('/projects/my-projects', {
        onRequest: [authMiddleware],
        schema: {
            summary: 'Listar meus projetos',
            description: 'Permite que um usuário veja todos os seus projetos.',
            tags: ['Projetos'],
            security: [{ bearerAuth: [] }],
            query: z.object({
                page: z.coerce.number().int().min(0).optional().default(0),
                pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
            }),
            response: { 200: z.array(ProjectResponseSchema) },
        }
    }, projectController.listMyProjects);
}
