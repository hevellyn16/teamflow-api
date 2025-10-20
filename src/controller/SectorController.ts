import type { FastifyReply } from "fastify";
import { SectorCreateBodySchema } from "../dto/setor/SectorCreateBodySchema";
import { SectorUpdateBodySchema } from "../dto/setor/SectorUpdateBodySchema";
import { SectorService } from "../service/SectorService";
import { z } from "zod";
import { PrismaSectorRepository } from "../repositories/prisma/PrismaSectorRepository";
import { request } from "https";

export class SectorController {
    private readonly sectorService = new SectorService(new PrismaSectorRepository());

    createSector = async (request: any, reply: FastifyReply) => {
        const body = SectorCreateBodySchema.parse(request.body);
        const sector = await this.sectorService.createSector(body);
        return reply.status(201).send(sector);
    }

    getAllSectors = async (request: any, reply: FastifyReply) => {
        const sectors = await this.sectorService.getAllSectors();
        return reply.status(200).send(sectors);
    }

    getSectorById = async (request: any, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const sector = await this.sectorService.getSectorById(id);
        if (!sector) {
            return reply.status(404).send({ error: 'Sector not found' });
        }
        return reply.status(200).send(sector);
    }

    updateSector = async (request: any, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const body = SectorUpdateBodySchema.parse(request.body);
        try {
            const updatedSector = await this.sectorService.updateSector(id, body);
            return reply.status(200).send(updatedSector);
        }
        catch (error) {
            return reply.status(404).send({ error: (error as Error).message });
        }
    }

    deleteSector = async (request: any, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        try {
            const deletedSector = await this.sectorService.deleteSector(id);
            return reply.status(200).send(deletedSector);
        }
        catch (error) {
            return reply.status(404).send({ error: (error as Error).message });
        }
    }

    filterSectorsByName = async (request: any, reply: FastifyReply) => {
        const querySchema = z.object({
            name: z.string().min(1, "Name is required"),
        });
        const { name } = querySchema.parse(request.query);
        const sectors = await this.sectorService.filterSectorsByName(name);
        return reply.status(200).send(sectors);
    }

    filterSectorsByDescription = async (request: any, reply: FastifyReply) => {
        const querySchema = z.object({
            description: z.string().min(1, "Description is required"),
        });
        const { description } = querySchema.parse(request.query);
        const sectors = await this.sectorService.filterSectorsByDescription(description);
        return reply.status(200).send(sectors);
    }

    filterSectorsByIsActive = async (request: any, reply: FastifyReply) => {
        const querySchema = z.object({
            isActive: z.coerce.boolean(),
        });
        const { isActive } = querySchema.parse(request.query);
        const sectors = await this.sectorService.filterSectorsByIsActive(isActive);
        return reply.status(200).send(sectors);
    }

    listOrFilter = async (request: any, reply: FastifyReply) => {
        const filters = request.query as { name?: string; description?: string; isActive?: boolean };

        try {
            const sectors = await this.sectorService.listOrFilter(filters);
            return reply.status(200).send(sectors);
        } catch (err) {
            console.error("Error fetching sectors:", err); 
            return reply.status(500).send({ error: "Internal server error" });
        }
    }
}
