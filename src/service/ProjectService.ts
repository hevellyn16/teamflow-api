import { Project, ProjectStatus } from "@prisma/client";
import { ProjectRepository } from "../repositories/interface/ProjectRepository";
import { ProjectCreateBody } from "../dto/project/ProjectCreateBodySchema";
import { ProjectUpdateBody } from "../dto/project/ProjectUpdateBodySchema";

export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async createProject(data: ProjectCreateBody): Promise<Project> {
        const sectorExistsByName = await this.projectRepository.filterByName(data.name);

        if (sectorExistsByName.length > 0) {
            throw new Error('Project with this name already exists');
        }

        const project = await this.projectRepository.create({
            name: data.name,
            description: data.description,
            ProjectStatus: data.ProjectStatus as ProjectStatus,
            sector: data.sector as string,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            users: data.users,
        });
        return project;
    }

    async getAllProjects(): Promise<Project[]> {
        return await this.projectRepository.findAll();
    }

    async getProjectById(id: string): Promise<Project | null> {
        return await this.projectRepository.findById(id);
    }

    async updateProject(id: string, data: ProjectUpdateBody): Promise<Project | null> {
        return await this.projectRepository.update(id, data);
    }

    async deleteProject(id: string): Promise<Project | null> {
        return await this.projectRepository.delete(id);
    }

    async filterProjectsByName(name: string): Promise<Project[]> {
        return await this.projectRepository.filterByName(name);
    }

    async filterProjectsByStatus(status: string): Promise<Project[]> {
        return await this.projectRepository.filterByStatus(status);
    }

    async filterProjectsBySector(sectorId: string): Promise<Project[]> {
        return await this.projectRepository.filterBySector(sectorId);
    }

    async filterProjectsByUser(userId: string): Promise<Project[]> {
        return await this.projectRepository.filterByUser(userId);
    }

    async filterProjectsByIsActive(isActive: boolean): Promise<Project[]> {
        return await this.projectRepository.filterByIsActive(isActive);
    }
}