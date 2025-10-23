import { Sector } from "@prisma/client";
import { SectorUpdateBody } from "../../dto/sector/SectorUpdateBodySchema";
import { SectorCreateBody } from "../../dto/sector/SectorCreateBodySchema";
import { SectorRepository } from "../interface/SectorRepository";
import { prisma } from "../../lib/prisma";

export class PrismaSectorRepository implements SectorRepository {
    async create(data: SectorCreateBody): Promise<Sector> {
        return await prisma.sector.create({
            data,
        });
    }

    async update(id: string, data: SectorUpdateBody): Promise<Sector | null> {
        return await prisma.sector.update({
            where: { id },
            data,
        });
    }

    async deactivate(id: string): Promise<Sector | null> {
        return await prisma.sector.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        });
    }

    async findById(id: string): Promise<Sector | null> {
        return await prisma.sector.findUnique({
            where: { id },
        });
    }

    async findAll(): Promise<Sector[]> {
        return await prisma.sector.findMany();
    }

    async filterByName(name: string): Promise<Sector[]> {
        return await prisma.sector.findMany({
            where: { name },
        });
    }

    async filterByDescription(description: string): Promise<Sector[]> {
        return await prisma.sector.findMany({
            where: { description },
        });
    }

    async filterByIsActive(isActive: boolean): Promise<Sector[]> {
        return await prisma.sector.findMany({
            where: { isActive },
        });
    }

    async listOrFilter(filters: any): Promise<Sector[]> {
        const whereClause: any = {};
        if (filters.name) {
            whereClause.name = { contains: filters.name, mode: 'insensitive' };
        }
        if (filters.description) {
            whereClause.description = { contains: filters.description, mode: 'insensitive' };
        }
        if (filters.isActive !== undefined) {
            whereClause.isActive = filters.isActive === 'true';
        }
        return await prisma.sector.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
        });
    }

}