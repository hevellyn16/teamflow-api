import { hash } from "bcryptjs";
import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";
import { User } from "@prisma/client";
import { UserUpdateBody } from "../dto/user/UserUpdateBodySchema";

export class UpdateProfileService {
    constructor(private readonly userRepository: PrismaUserRepository) {}

    async execute(userId: string, data: UserUpdateBody): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if(data.password){
            data.password = await hash(data.password, 8);
        }

        if(data.email){
            const userWithEmail = await this.userRepository.findByEmail(data.email);
            if (userWithEmail && userWithEmail.id !== userId) {
                throw new Error('Email already in use');
            }
        }

        const updateUser = await this.userRepository.update(
            data, userId
        );
        return updateUser;
    }
}