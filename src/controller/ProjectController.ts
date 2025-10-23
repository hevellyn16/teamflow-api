import { FastifyReply } from "fastify";
import { ProjectCreateBodySchema } from "../dto/project/ProjectCreateBodySchema";
import { ProjectUpdateBodySchema } from "../dto/project/ProjectUpdateBodySchema";
import { ProjectService } from "../service/ProjectService";
import { email, z } from "zod";
import { PrismaProjectRepository } from "../repositories/prisma/PrismaProjectRepository";

export class ProjectController {
    private readonly projectService = new ProjectService(new PrismaProjectRepository());

    createProject = async (request: any, reply: FastifyReply) => {
        const body = ProjectCreateBodySchema.parse(request.body);
        const project = await this.projectService.createProject(body);
        return reply.status(201).send(project);
    }

    getAllProjects = async (request: any, reply: FastifyReply) => {
        const projects = await this.projectService.getAllProjects();
        return reply.status(200).send(projects);
    }

    getProjectById = async (request: any, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const project = await this.projectService.getProjectById(id);
        if (!project) {
            return reply.status(404).send({ error: 'Project not found' });
        }
        return reply.status(200).send(project);
    }

    updateProject = async (request: any, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const body = ProjectUpdateBodySchema.parse(request.body);
        try {
            const updatedProject = await this.projectService.updateProject(id, body);
            return reply.status(200).send(updatedProject);
        } catch (error) {
            return reply.status(404).send({ error: (error as Error).message });
        }
    }

    deactivateProject = async (request: any, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        try {
            await this.projectService.deactivateProject(id);
            return reply.status(204).send();
        } catch (error) {
            return reply.status(404).send({ error: (error as Error).message });
        }
    }

    filterProjectsByStatus = async (request: any, reply: FastifyReply) => {
        const querySchema = z.object({
            status: z.enum(['PLANEJAMENTO', 'EM_ANDAMENTO', 'PAUSADO', 'CONCLUIDO']),
        });
        const { status } = querySchema.parse(request.query);
        const projects = await this.projectService.filterProjectsByStatus(status);
        return reply.status(200).send(projects);
    }

    filterProjectsByIsActive = async (request: any, reply: FastifyReply) => {
        const querySchema = z.object({
            isActive: z.coerce.boolean(),
        });
        const { isActive } = querySchema.parse(request.query);
        const projects = await this.projectService.filterProjectsByIsActive(isActive);
        return reply.status(200).send(projects);
    }

    filterProjectsBySector = async (request: any, reply: FastifyReply) => {
        const querySchema = z.object({
            sectorId: z.string().uuid(),
        });
        const { sectorId } = querySchema.parse(request.query);
        const projects = await this.projectService.filterProjectsBySector(sectorId);
        return reply.status(200).send(projects);
    }

    filterProjectsByUser = async (request: any, reply: FastifyReply) => {
        const querySchema = z.object({
            userId: z.string().uuid(),
        });
        const { userId } = querySchema.parse(request.query);
        const projects = await this.projectService.filterProjectsByUser(userId);
        return reply.status(200).send(projects);
    }

    filterProjectsByName = async (request: any, reply: FastifyReply) => {
        const querySchema = z.object({
            name: z.string().min(1, "Name is required"),
        });
        const { name } = querySchema.parse(request.query);
        const projects = await this.projectService.filterProjectsByName(name);
        return reply.status(200).send(projects);
    }
}   