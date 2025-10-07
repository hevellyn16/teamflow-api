import { UserCreateBody } from "../dto/user/UserCreateBodySchema";
import { UserRepository } from "../repositories/interface/UserRepository";
import { User } from '@prisma/client';
import { prisma } from "../lib/prisma";

export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(data: UserCreateBody): Promise<User> {
        const userExistsByEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (userExistsByEmail) {
            throw new Error('Email already in use');
        }

        const user = await this.userRepository.createUser(data);
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAllUsers();
    }

}