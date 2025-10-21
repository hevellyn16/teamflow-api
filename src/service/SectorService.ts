import { Sector } from "@prisma/client";
import { SectorCreateBody } from "../dto/sector/SectorCreateBodySchema";
import { SectorUpdateBody } from "../dto/sector/SectorUpdateBodySchema";
import { SectorRepository } from "../repositories/interface/SectorRepository";

export class SectorService {
    constructor(private readonly sectorRepository: SectorRepository) {}

    async createSector(data: SectorCreateBody): Promise<Sector> {
        const sectorExistsByName = await this.sectorRepository.filterByName(data.name);

        if (sectorExistsByName.length > 0) {
            throw new Error('Sector with this name already exists');
        }

        const sector = await this.sectorRepository.create({
            name: data.name,
            description: data.description,
            isActive: true,
        });
        return sector;
    }

    async getAllSectors(): Promise<Sector[]> {
        return await this.sectorRepository.findAll();
    }

    async getSectorById(id: string): Promise<Sector | null> {
        const sector = await this.sectorRepository.findById(id);
        return sector;
    }

    async updateSector(id: string, data: SectorUpdateBody): Promise<Sector> {
        const sector = await this.sectorRepository.findById(id); // Garante que o setor existe
        if (!sector) {
            throw new Error('Setor not found');
        }
        const updatedSector = await this.sectorRepository.update(id, data);
        if (!updatedSector) {
            throw new Error('Failed to update setor');
        }
        return updatedSector;
    }

    async deleteSector(id: string): Promise<Sector> {
        const sector = await this.sectorRepository.findById(id);
        if (!sector) {
            throw new Error('Sector not found');
        }
        const deletedSector = await this.sectorRepository.delete(id);
        if (!deletedSector) {
            throw new Error('Failed to delete sector');
        }
        return deletedSector;
    }

    async filterSectorsByName(name: string): Promise<Sector[]> {
        return this.sectorRepository.filterByName(name);
    }

    async filterSectorsByDescription(description: string): Promise<Sector[]> {
        return this.sectorRepository.filterByDescription(description);
    }

    async filterSectorsByIsActive(isActive: boolean): Promise<Sector[]> {
        return this.sectorRepository.filterByIsActive(isActive);
    }

    async listOrFilter(filters: any): Promise<Sector[]> {
        return this.sectorRepository.listOrFilter(filters);
    }
}