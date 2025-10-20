import { Project, ProjectStatus } from "@prisma/client";
import { ProjectUpdateBody } from "../../dto/project/ProjectUpdateBodySchema";
import { ProjectCreateBody } from "../../dto/project/ProjectCreateBodySchema";
import { ProjectRepository } from "../interface/ProjectRepository";
import { prisma } from "../../lib/prisma";

export class PrismaProjectRepository implements ProjectRepository {
    async create(data: ProjectCreateBody): Promise<Project> {
        // map DTO fields to Prisma create input: connect sector by id and map ProjectStatus -> status
        const { sector, ProjectStatus: dtoStatus, users, ...rest } = data;
        return await prisma.project.create({
            data: {
                ...rest,
                status: dtoStatus as ProjectStatus,
                setor: {
                    connect: { id: sector },
                },
                users: users
                    ? {
                          connect: users.map((userId) => ({ id: userId })),
                      }
                    : undefined,
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
            updateData.setor = {
                connect: { id: sector },
            };
        }

        if (users) {
            updateData.users = {
                set: users.map((userId) => ({ id: userId })),
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
        const projects = await prisma.project.findMany({
            where: { name },
        });
        return projects[0] || null;
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

    async filterByName(name: string): Promise<Project[]> {
        return await prisma.project.findMany({
            where: { name },
        });
    }
}