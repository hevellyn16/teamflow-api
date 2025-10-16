import { Sector } from "@prisma/client";
import { SectorCreateBody } from "../dto/setor/SectorCreateBodySchema";
import { SectorUpdateBody } from "../dto/setor/SectorUpdateBodySchema";
import { SectorRepository } from "../repositories/interface/SectorRepository";

export class SectorService {
    constructor(private readonly sectorRepository: SectorRepository) {}

    async createSetor(data: SectorCreateBody): Promise<Sector> {
        const setor = await this.sectorRepository.create(data);
        return setor;
    }

    async getAllSetores(): Promise<Sector[]> {
        return await this.sectorRepository.findAll();
    }

    async getSetorById(id: string): Promise<Sector | null> {
        const setor = await this.sectorRepository.findById(id);
        return setor;
    }

    async updateSetor(id: string, data: SectorUpdateBody): Promise<Sector> {
        const setor = await this.sectorRepository.findById(id); // Garante que o setor existe
        if (!setor) {
            throw new Error('Setor not found');
        }
        const updatedSetor = await this.sectorRepository.update(id, data);
        if (!updatedSetor) {
            throw new Error('Failed to update setor');
        }
        return updatedSetor;
    }

    async deleteSetor(id: string): Promise<Sector> {
        const setor = await this.sectorRepository.findById(id);
        if (!setor) {
            throw new Error('Setor not found');
        }
        const deletedSetor = await this.sectorRepository.delete(id);
        if (!deletedSetor) {
            throw new Error('Failed to delete setor');
        }
        return deletedSetor;
    }

    async filterSetorsByName(name: string): Promise<Sector[]> {
        return this.sectorRepository.filterByName(name);
    }

    async filterSetorsByDescription(description: string): Promise<Sector[]> {
        return this.sectorRepository.filterByDescription(description);
    }

    async filterSetorsByIsActive(isActive: boolean): Promise<Sector[]> {
        return this.sectorRepository.filterByIsActive(isActive);
    }
}