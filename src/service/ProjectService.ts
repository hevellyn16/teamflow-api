import { Project, ProjectStatus } from "@prisma/client";
import { ProjectRepository } from "../repositories/interface/ProjectRepository";
import { ProjectCreateBody } from "../dto/project/ProjectCreateBodySchema";
import { ProjectUpdateBody } from "../dto/project/ProjectUpdateBodySchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async createProject(data: ProjectCreateBody): Promise<Project> {
        try {
            const project = await this.projectRepository.create(data); 
            return project;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    
                    if ((error.meta?.target as string[])?.includes('unique_project_name_per_sector')) { 
                        throw new Error("An active project with this name already exists in this sector.");
                    }
                    throw new Error("Failed to create project: uniqueness violation.");
                }
                
                if (error.code === 'P2003' || error.code === 'P2025') {
                     
                     const field = error.meta?.field_name as string || ''; 
                     if (field.includes('setorId')) { 
                         throw new Error('Sector not found.');
                     }
                     if (field.includes('User')) { 
                         throw new Error('One or more users not found.');
                     }
                    throw new Error('Related record not found.');
                }
            }
            
            throw error;
        }
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

    async deactivateProject(id: string): Promise<void> {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        await this.projectRepository.update(id, {
            isActive: false,
            updatedAt: new Date(),
        });
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