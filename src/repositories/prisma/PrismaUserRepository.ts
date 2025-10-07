import type { User } from '@prisma/client';
import type { UserRepository } from '../interface/UserRepository';
import { prisma } from '../../lib/prisma';
import { UserCreateBody } from '../../dto/user/UserCreateBodySchema';

export class PrismaUserRepository implements UserRepository {
    async findAllUsers(): Promise<User[]> {
        return await prisma.user.findMany();
    }
    async createUser({ name, email, password }: UserCreateBody): Promise<User> {
        return await prisma.user.create({
            data: {
                name,
                email,
                password,
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email },
        });
    }
}