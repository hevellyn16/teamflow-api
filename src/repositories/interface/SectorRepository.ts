import { Sector } from "@prisma/client";
import { SectorUpdateBody } from "../../dto/sector/SectorUpdateBodySchema";

export interface SectorRepository {
    create(data: {
        name: string;
        description?: string;
        isActive: boolean;
    }): Promise<Sector>;

    update(id: string, data: SectorUpdateBody): Promise<Sector | null>;

    deactivate(id: string): Promise<Sector | null>;

    findById(id: string): Promise<Sector | null>;

    findAll(): Promise<Sector[]>;

    filterByName(name: string): Promise<Sector[]>;

    filterByDescription(description: string): Promise<Sector[]>;

    filterByIsActive(isActive: boolean): Promise<Sector[]>;

    listOrFilter(filters: { name?: string; description?: string}): Promise<Sector[]>;

    delete(id: string): Promise<void>;

    verifyIfSectorHasProjectsActive(sectorId: string): Promise<boolean>;
}