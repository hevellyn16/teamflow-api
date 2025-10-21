import { Project, ProjectStatus } from "@prisma/client";
import { ProjectRepository } from "../repositories/interface/ProjectRepository";
import { ProjectCreateBody } from "../dto/project/ProjectCreateBodySchema";
import { ProjectUpdateBody } from "../dto/project/ProjectUpdateBodySchema";

export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async createProject(data: ProjectCreateBody): Promise<Project> {

        const exists = await this.projectRepository.findByName(data.name);

        const sector = data.sector ? data.sector : '';

        if (exists && exists.sectorId === sector) {
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
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    }

    async updateProject(id: string, data: ProjectUpdateBody): Promise<Project | null> {
        const project = await this.projectRepository.findById(id); 
        
        if (!project) {
            throw new Error('Project not found');
        }

        if (data.name) {
            const projectExistsByName = await this.projectRepository.findByName(data.name);
            if (projectExistsByName && projectExistsByName.id !== id) {
                throw new Error('Project with this name already exists');
            }
        }

        const updatedProject = await this.projectRepository.update(id, data);
        return updatedProject;
    }

    async deleteProject(id: string): Promise<Project | null> {
        return await this.projectRepository.delete(id);
    }

    async filterProjectsByName(name: string): Promise<Project | null> {
        return await this.projectRepository.findByName(name);
    }

    async filterProjectsByStatus(status: string): Promise<Project[] | null> {
        return await this.projectRepository.filterByStatus(status);
    }

    async filterProjectsBySector(sectorId: string): Promise<Project[] | null> {
        return await this.projectRepository.filterBySector(sectorId);
    }

    async filterProjectsByUser(userId: string): Promise<Project[] | null> {
        return await this.projectRepository.filterByUser(userId);
    }

    async filterProjectsByIsActive(isActive: boolean): Promise<Project[] | null> {
        return await this.projectRepository.filterByIsActive(isActive);
    }
}