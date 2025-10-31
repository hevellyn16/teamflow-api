import { Project } from "@prisma/client";
import { ProjectUpdateBody } from "../../dto/project/ProjectUpdateBodySchema";

export interface ProjectRepository {
    create(data: {
        name: string;
        description?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ProjectStatus: 'PLANEJAMENTO' | 'EM_ANDAMENTO' | 'PAUSADO' | 'CONCLUIDO';
        sector: string;
        startDate?: Date;
        users?: string[];
    }): Promise<Project>;

    update(id: string, data: ProjectUpdateBody): Promise<Project | null>;

    findById(id: string): Promise<Project | null>;

    findAll(page: number, pageSize: number): Promise<Project[]>;

    findByName(name: string): Promise<Project | null>;

    filterByStatus(status: string): Promise<Project[]>;

    filterBySector(sectorId: string): Promise<Project[]>;

    filterByUser(userId: string): Promise<Project[] | undefined>;

    deactivate(id: string): Promise<Project | null>;

    removeMember(projectId: string, userIdToRemove: string): Promise<Project>;

    listMyProjects(userId: string): Promise<Project[]>;

    delete(id: string): Promise<void>;

    verifyIfProjectHasMembers(projectId: string): Promise<boolean>;
}