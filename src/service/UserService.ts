import { hash } from "bcryptjs";
import { UserCreateBody } from "../dto/user/UserCreateBodySchema";
import { UserRepository } from "../repositories/interface/UserRepository";
import { User } from '@prisma/client';

export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(data: UserCreateBody): Promise<User> {
        const userExistsByEmail = await this.userRepository.findByEmail(data.email);

        if (userExistsByEmail) {
            throw new Error('Email already in use');
        }

        const passwordHash = await hash(data.password, 8);
        const user = await this.userRepository.createUser({
            name: data.name,
            email: data.email,
            password: passwordHash,
        });
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAllUsers();
    }

}