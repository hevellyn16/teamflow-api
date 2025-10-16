import type { FastifyReply } from "fastify";
import { SectorCreateBodySchema } from "../dto/setor/SectorCreateBodySchema";
import { SectorUpdateBodySchema } from "../dto/setor/SectorUpdateBodySchema";
import { SectorService } from "../service/SectorService";
import { z } from "zod";
import { PrismaSectorRepository } from "../repositories/prisma/PrismaSectorRepository";

export class SectorController {
    private readonly setorService = new SectorService(new PrismaSectorRepository());

    async createSetor(request: any, reply: FastifyReply) {
        const body = SectorCreateBodySchema.parse(request.body);
        const setor = await this.setorService.createSetor(body);
        return reply.status(201).send(setor);
    }

    async getAllSetores(request: any, reply: FastifyReply) {
        const setores = await this.setorService.getAllSetores();
        return reply.status(200).send(setores);
    }

    async getSetorById(request: any, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const setor = await this.setorService.getSetorById(id);
        if (!setor) {
            return reply.status(404).send({ error: 'Setor not found' });
        }
        return reply.status(200).send(setor);
    }

    async updateSetor(request: any, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const body = SectorUpdateBodySchema.parse(request.body);
        try {
            const updatedSetor = await this.setorService.updateSetor(id, body);
            return reply.status(200).send(updatedSetor);
        }
        catch (error) {
            return reply.status(404).send({ error: (error as Error).message });
        }
    }

    async deleteSetor(request: any, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        try {
            const deletedSetor = await this.setorService.deleteSetor(id);
            return reply.status(200).send(deletedSetor);
        }
        catch (error) {
            return reply.status(404).send({ error: (error as Error).message });
        }
    }

    async filterSetorsByName(request: any, reply: FastifyReply) {
        const querySchema = z.object({
            name: z.string().min(1, "Name is required"),
        });
        const { name } = querySchema.parse(request.query);
        const setores = await this.setorService.filterSetorsByName(name);
        return reply.status(200).send(setores);
    }

    async filterSetorsByDescription(request: any, reply: FastifyReply) {
        const querySchema = z.object({
            description: z.string().min(1, "Description is required"),
        });
        const { description } = querySchema.parse(request.query);
        const setores = await this.setorService.filterSetorsByDescription(description);
        return reply.status(200).send(setores);
    }

    async filterSetorsByIsActive(request: any, reply: FastifyReply) {
        const querySchema = z.object({
            isActive: z.coerce.boolean(),
        });
        const { isActive } = querySchema.parse(request.query);
        const setores = await this.setorService.filterSetorsByIsActive(isActive);
        return reply.status(200).send(setores);
    }
}
