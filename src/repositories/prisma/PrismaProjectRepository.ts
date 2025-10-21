import { Project, ProjectStatus } from "@prisma/client";
import { ProjectUpdateBody } from "../../dto/project/ProjectUpdateBodySchema";
import { ProjectCreateBody } from "../../dto/project/ProjectCreateBodySchema";
import { ProjectRepository } from "../interface/ProjectRepository";
import { prisma } from "../../lib/prisma";

export class PrismaProjectRepository implements ProjectRepository {
    async create(data: ProjectCreateBody): Promise<Project>  {
        return await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                isActive: data.isActive,
                createdAt: data.createdAt,
                sector: {
                    connect: { id: data.sector },
                },
                users: data.users
                    ? {
                          connect: data.users.map((email) => ({ email })),
                      }
                    : undefined,
                status: data.ProjectStatus as ProjectStatus,
                startDate: data.startDate,
            },
        });
    }

    async update(id: string, data: ProjectUpdateBody): Promise<Project | null> {
        const { sector, ProjectStatus: dtoStatus, users, ...rest } = data;

        const updateData: any = { ...rest };

        if (dtoStatus) {
            updateData.status = dtoStatus as ProjectStatus;
        }

        if (sector) {
            updateData.sector = {
                connect: { id: sector },
            };
        }

        if (users) {
            updateData.users = {
                set: users.map((email) => ({ email })),
            };
        }

        return await prisma.project.update({
            where: { id },
            data: updateData,
        });
    }

    async delete(id: string): Promise<Project | null> {
        return await prisma.project.delete({
            where: { id },
        });
    }

    async findById(id: string): Promise<Project | null> {
        return await prisma.project.findUnique({
            where: { id },
        });
    }

    async findAll(): Promise<Project[]> {
        return await prisma.project.findMany();
    }

    async findByName(name: string): Promise<Project | null> {
        return await prisma.project.findFirst({
            where: { 
                name: { contains: name, mode: 'insensitive' }
            },
        });
    }

    async filterByIsActive(isActive: boolean): Promise<Project[]> {
        return await prisma.project.findMany({
            where: { isActive },
        });
    }

    async filterByStatus(status: ProjectStatus): Promise<Project[]> {
        return await prisma.project.findMany({
            where: { status: status },
        });
    }

    async filterBySector(sectorId: string): Promise<Project[]> {
        return await prisma.project.findMany({
            where: { sectorId },
        });
    }

    async filterByUser(userId: string): Promise<Project[]> {
        return await prisma.project.findMany({
            where: {
                users: {
                    some: {
                        id: userId,
                    },
                },
            },
        });
    }
}