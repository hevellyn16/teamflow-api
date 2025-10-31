import { Project, ProjectStatus, Role } from "@prisma/client";
import { ProjectRepository } from "../repositories/interface/ProjectRepository";
import { ProjectCreateBody } from "../dto/project/ProjectCreateBodySchema";
import { ProjectUpdateBody } from "../dto/project/ProjectUpdateBodySchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UserRepository } from "../repositories/interface/UserRepository";

export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly userRepository: UserRepository
    ) {}

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

    async getAllProjects(page: number, pageSize: number): Promise<Project[]> {
        return await this.projectRepository.findAll( page, pageSize);
    }

    async getProjectById(id: string): Promise<Project | null> {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    }

    async updateProject(id: string, data: ProjectUpdateBody, actorId: string, actorRole: string): Promise<Project | null> {
        const project = await this.projectRepository.findById(id); 
        
        if (!project) {
            throw new Error('Project not found');
        }

        if (actorRole === 'COORDENADOR') {
            const isUserInProject = await this.projectRepository.filterByUser(actorId);
            if (!isUserInProject) {
                throw new Error('Coordenador não autorizado a atualizar este projeto');
            }
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
            isDeleted: false
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

    async filterProjectsByUser(userId: string): Promise<Project[] | undefined> {
        return await this.projectRepository.filterByUser(userId);
    }

    async listMyProjects(userId: string, actorId: string): Promise<Project[]> {
        
        const user = await this.projectRepository.listMyProjects(userId);

        if (actorId !== userId) {
            throw new Error("You are not authorized to view projects of other users.");
        }

        return user;
    }

    async removeMember(projectId: string, userIdToRemove: string, actorId: string, actorRole: Role): Promise<Project> {

        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new Error("Project not found.");
        }

        const userToRemove = await this.userRepository.findById(userIdToRemove);
        if (!userToRemove) {
            throw new Error("User to be removed not found.");
        }

        if (actorRole === Role.COORDENADOR) {
            const isMember = await this.projectRepository.filterByUser(actorId);
            if (!isMember) {
                throw new Error("Coordenador is not authorized to remove members from this project.");
            }
            if (userToRemove.role === Role.DIRETOR) {
                throw new Error("Coordenador cannot remove Director from projects.");
            }
        }

        return this.projectRepository.removeMember(projectId, userIdToRemove);
    }

    async deleteProject(id: string): Promise<void> {
        const project = await this.projectRepository.findById(id);
        if (!project) {
            throw new Error("Project not found.");
        }
        await this.projectRepository.delete(id);
    }

    async verifyIfProjectHasMembers(projectId: string): Promise<boolean> {
        return this.projectRepository.verifyIfProjectHasMembers(projectId);
    }
}