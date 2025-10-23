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

    findAll(): Promise<Project[]>;

    findByName(name: string): Promise<Project | null>;

    filterByIsActive(isActive: boolean): Promise<Project[]>;

    filterByStatus(status: string): Promise<Project[]>;

    filterBySector(sectorId: string): Promise<Project[]>;

    filterByUser(userId: string): Promise<Project[]>;

    deactivate(id: string): Promise<Project | null>;
}