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
                set: users.map((id) => ({ id })),
            };
        }

        return await prisma.project.update({
            where: { id },
            data: updateData,
        });
    }

    async deactivate(id: string): Promise<Project | null> {
        return await prisma.project.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date(),
            },
        });
    }
    
    async findById(id: string): Promise<Project | null> {
        return await prisma.project.findUnique({
            where: { id },
            include: { users: true },
        });
    }

    async findAll(page:number, pageSize:number): Promise<Project[]> {
        const skipAmount = page * pageSize;

        return await prisma.project.findMany({
            where: { isActive: true },
            skip: skipAmount,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: { sector: true, users: true },
        });
    }

    async findByName(name: string): Promise<Project | null> {
        return await prisma.project.findFirst({
            where: { 
                name: { contains: name, mode: 'insensitive' }
            },
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
                isActive: true,
                users: {
                    some: {
                        id: userId,
                    },
                },
            },
            include: { sector: true, users: true },
        });
    }

    async listMyProjects(userId: string): Promise<Project[]> {
        return await prisma.project.findMany({
            where: {
                isActive: true,
                users: {
                    some: {
                        id: userId,
                    },
                },
            },
            include: {
                sector: true, 
                users: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    }
                }
            },
            orderBy: { name: 'asc' },
        });
    }

    async removeMember(projectId: string, userId: string): Promise<Project> {
        return prisma.project.update({
            where: { id: projectId },
            data: {
                users: {
                    disconnect: { id: userId }
                }
            },
    
            include: {
                users: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                    }
                },
                sector: true,
            }
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.project.delete({
            where: { id },
        });
    }

    verifyIfProjectHasMembers(projectId: string): Promise<boolean> {
        return prisma.project.findUnique({
            where: { id: projectId },
            select: { users: { select: { id: true } } }
        }).then(project => {
            if (!project) {
                throw new Error("Project not found.");
            }
            return project.users && project.users.length > 0;
        });
    }
}