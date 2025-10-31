import { FastifyReply } from "fastify";
import { ProjectCreateBodySchema } from "../dto/project/ProjectCreateBodySchema";
import { ProjectUpdateBodySchema } from "../dto/project/ProjectUpdateBodySchema";
import { ProjectService } from "../service/ProjectService";
import { email, z } from "zod";
import { PrismaProjectRepository } from "../repositories/prisma/PrismaProjectRepository";
import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";

export class ProjectController {
    private readonly projectService = new ProjectService(new PrismaProjectRepository(), new PrismaUserRepository());


    createProject = async (request: any, reply: FastifyReply) => {
        const body = ProjectCreateBodySchema.parse(request.body);
        const project = await this.projectService.createProject(body);
        return reply.status(201).send(project);
    }

    getAllProjects = async (request: any, reply: FastifyReply) => {
        const { page, pageSize } = request.query as { page: number, pageSize: number }; // Zod já validou
        const projects = await this.projectService.getAllProjects(page, pageSize);
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
        const actorId = request.user.sub;
        const actorRole = request.user.role;
        const body = ProjectUpdateBodySchema.parse(request.body);
        try {
            const updatedProject = await this.projectService.updateProject(id, body, actorId, actorRole);
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

    filterProjectsBySector = async (request: any, reply: FastifyReply) => {
        const querySchema = z.object({
            sectorId: z.uuid(),
        });
        const { sectorId } = querySchema.parse(request.query);
        const projects = await this.projectService.filterProjectsBySector(sectorId);
        return reply.status(200).send(projects);
    }

    filterProjectsByUser = async (request: any, reply: FastifyReply) => {
        const querySchema = z.object({
            userId: z.uuid(),
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

    listMyProjects = async (request: any, reply: FastifyReply) => {
        const userId = request.user as { sub?: string } | undefined;
        const actorId = userId?.sub;
        if (!actorId) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
        try {
            const projects = await this.projectService.filterProjectsByUser(actorId);
            return reply.status(200).send(projects);
        } catch (error) {
            return reply.status(500).send({ error: (error as Error).message });
        }
    }
    
    removeMember = async (request: any, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
            userId: z.uuid(),
        });
        const { id: projectId, userId: userIdToRemove } = paramsSchema.parse(request.params);
        const actorId = request.user.sub;
        const actorRole = request.user.role;
        const userIdToRemoveRole = request.user.role;

        if (actorRole == "COORDENADOR" && userIdToRemoveRole == "DIRETOR") {
            return reply.status(403).send({ error: "Coordenador cannot remove Director from projects." });
        }
        try {
            const updatedProject = await this.projectService.removeMember(
                projectId,
                userIdToRemove,
                actorId,
                actorRole
            );
            return reply.status(200).send(updatedProject);
        } catch (err) {
            throw err;
        }
    };

    verifyIfProjectHasMembers = async (request: any, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id: projectId } = paramsSchema.parse(request.params);
        try {
            const hasMembers = await this.projectService.verifyIfProjectHasMembers(projectId);
            return reply.status(200).send({ hasMembers });
        } catch (error) {
            return reply.status(404).send({ error: (error as Error).message });
        }
    };

    deleteProject = async (request: any, reply: FastifyReply) => {
        const paramsSchema = z.object({
        id: z.uuid(),
    });
        const { id: projectId } = paramsSchema.parse(request.params);
        const verifyIfProjectHasMembers = await this.projectService.verifyIfProjectHasMembers(projectId);
        try {
            if (verifyIfProjectHasMembers) {
                return reply.status(400).send({ error: "Cannot delete project with members." });
            } else {
                await this.projectService.deleteProject(projectId);
                return reply.status(204).send();
            }
        } catch (error) {
            return reply.status(404).send({ error: (error as Error).message });
        }
    };
}