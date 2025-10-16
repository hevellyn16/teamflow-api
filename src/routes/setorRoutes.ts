import type { FastifyInstance } from "fastify";
import { SetorController } from "../controller/SectorController";
import { authMiddleware, verifyUserRole } from "../middlewares/auth";
import { z } from "zod";
import { Role } from "@prisma/client";
import { SetorCreateBodySchema } from "../dto/setor/SectorCreateBodySchema";
import { SetorUpdateBodySchema } from "../dto/setor/SectorUpdateBodySchema";

// Schema para a resposta de um setor
const SetorResponseSchema = z.object({
    id: z.uuid(),
    nome: z.string(),
    descricao: z.string().nullable(),
    criadoEm: z.date(),
    atualizadoEm: z.date(),
});

export async function setorRoutes(app: FastifyInstance) {
    const setorController = new SetorController();

    /** Rotas de Gerenciamento de Setores (Acesso de Diretor) **/
    app.post('/setores', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Criar um novo setor (Diretor)',
            description: 'Permite que um Diretor crie novos setores.',
            tags: ['Setores'],
            security: [{ bearerAuth: [] }],
            body: SetorCreateBodySchema,
            response: { 201: SetorResponseSchema },
        }
    }, setorController.createSetor.bind(setorController));

    app.get('/setores', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Listar todos os setores (Diretor)',
            description: 'Permite que um Diretor veja todos os setores cadastrados.',
            tags: ['Setores'],
            security: [{ bearerAuth: [] }],
            response: { 200: z.array(SetorResponseSchema) },
        }
    }, setorController.getAllSetores.bind(setorController));

    app.get('/setores/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Obter um setor por ID (Diretor)',
            description: 'Permite que um Diretor veja os detalhes de um setor específico.',
            tags: ['Setores'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
            }),
            response: { 200: SetorResponseSchema },
        }
    }, setorController.getSetorById.bind(setorController));

    app.put('/setores/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Atualizar um setor por ID (Diretor)',
            description: 'Permite que um Diretor atualize os detalhes de um setor específico.',
            tags: ['Setores'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
            }),
            body: SetorUpdateBodySchema,
            response: { 200: SetorResponseSchema },
        }
    }, setorController.updateSetor.bind(setorController));

    app.delete('/setores/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Deletar um setor por ID (Diretor)',
            description: 'Permite que um Diretor delete um setor específico.',
            tags: ['Setores'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
            }),
            response: { 204: z.void() },
        }
    }, setorController.deleteSetor.bind(setorController));

    app.get('/setores/public', {
        onRequest: [authMiddleware],
        schema: {
            summary: 'Filtrar os setores (Acesso Público)',
            description: 'Permite que qualquer usuário (autenticado) filtre os setores por nome ou descrição.',
            tags: ['Setores'],
            security: [{ bearerAuth: [] }],
            query: z.object({
                name: z.string().min(1).optional(),
                description: z.string().min(1).optional(),
            }).refine(data => data.name || data.description, { message: "At least one of 'name' or 'description' must be provided" }),
            response: { 200: z.array(SetorResponseSchema) },
        }
    }, async (request, reply) => {
        const { name, description } = request.query as { name?: string; description?: string };
        if (name) {
            return setorController.filterSetorsByName(request, reply);
        }
        if (description) {
            return setorController.filterSetorsByDescription(request, reply);
        }
        return reply.status(200).send({ error: "At least one of 'name' or 'description' must be provided" });
    });
}
