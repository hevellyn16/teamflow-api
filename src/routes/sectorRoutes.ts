import type { FastifyInstance } from "fastify";
import { SectorController } from "../controller/SectorController";
import { authMiddleware, verifyUserRole } from "../middlewares/auth";
import { z } from "zod";
import { SectorCreateBodySchema } from "../dto/sector/SectorCreateBodySchema";
import { SectorUpdateBodySchema } from "../dto/sector/SectorUpdateBodySchema";

// Schema para a resposta de um setor
const SetorResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
});

export async function sectorRoutes(app: FastifyInstance) {
    const sectorController = new SectorController();

    /** Rotas de Gerenciamento de Setores (Acesso de Diretor) **/
    app.post('/sectors', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Criar um novo setor (Diretor)',
            description: 'Permite que um Diretor crie novos setores.',
            tags: ['Setores'],
            security: [{ bearerAuth: [] }],
            body: SectorCreateBodySchema,
            response: { 201: SetorResponseSchema },
        }
    }, sectorController.createSector);

    app.get('/sectors', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Listar todos os sectors (Diretor)',
            description: 'Permite que um Diretor veja todos os setores cadastrados.',
            tags: ['Setores'],
            security: [{ bearerAuth: [] }],
            response: { 200: z.array(SetorResponseSchema) },
        }
    }, sectorController.getAllSectors);

    app.get('/sectors/:id', {
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
    }, sectorController.getSectorById);

    app.put('/sectors/:id', {
        onRequest: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Atualizar um setor por ID (Diretor)',
            description: 'Permite que um Diretor atualize os detalhes de um setor específico.',
            tags: ['Setores'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                id: z.uuid(),
            }),
            body: SectorUpdateBodySchema,
            response: { 200: SetorResponseSchema },
        }
    }, sectorController.updateSector);

    app.delete('/sectors/:id', {
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
    }, sectorController.deleteSector);

     app.get('/sector', {
        preHandler: [authMiddleware, verifyUserRole('DIRETOR')],
        schema: {
            summary: 'Listar ou filtrar setores (Diretor)',
            description: 'Permite que um Diretor liste todos os setores ou filtre por nome, descrição ou status ativo.',
            tags: ['Setores'],
            security: [{ bearerAuth: [] }],
            params: z.object({
                name: z.string().min(1).optional(),
                description: z.string().min(1).optional(),
                isActive: z.coerce.boolean().optional(),
            }),
            response: { 200: z.array(SetorResponseSchema) },
    }
    }, sectorController.listOrFilter);
}