import type { User } from '@prisma/client';
import type { UserRepository } from '../interface/UserRepository';
import { prisma } from '../../lib/prisma';
import { UserCreateBody } from '../../dto/user/UserCreateBodySchema';
import { UserUpdateBody } from '../../dto/user/UserUpdateBodySchema';

export class PrismaUserRepository implements UserRepository {
    async update(data: UserUpdateBody, id: string): Promise<User> {
        return await prisma.user.update({
            where: { id },
            data,
        });
    }

    async findAllUsers(): Promise<User[]> {
        return await prisma.user.findMany();
    }

    async createUser({ name, email, password }: UserCreateBody): Promise<User> {
        return await prisma.user.create({
            data: {
                name,
                email,
                password,
                avatar: null,
                role: 'MEMBRO',
                isActive: true,
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id },
        });
    }

    async findByName(name: string): Promise<User | null> {
        return await prisma.user.findFirst({
            where: { name },
        });
    }

    async deactivate(id: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }
}