import { hash } from "bcryptjs";
import { UserCreateBody } from "../dto/user/UserCreateBodySchema";
import { UserRepository } from "../repositories/interface/UserRepository";
import { User } from '@prisma/client';
import { UserUpdateBody, UserUpdateBodySchema } from "../dto/user/UserUpdateBodySchema";
import { DIRUserUpdateBody, DIRUserUpdateBodySchema } from "../dto/user/DIRUserUpdateBodySchema";

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
            avatar: data.avatar,
            role: data.role,
            isActive: true,
        });
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAllUsers();
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getProfile(name: string): Promise<User> {
        const user = await this.userRepository.findByName(name);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUser(id: string, data: DIRUserUpdateBody): Promise<User> {
        const user = await this.userRepository.findById(id); // Garante que o usuário existe
        if (!user) {
            throw new Error('User not found');
        }

        if(data.email){
            const userWithEmail = await this.userRepository.findByEmail(data.email);
            if (userWithEmail && userWithEmail.id !== id) {
                throw new Error('Email already in use');
            }
        }

        if(data.password){
            data.password = await hash(data.password, 8);
        }
        
        const updatedUser = await this.userRepository.update(
            data, id
        );
        return updatedUser
    }

    async updateProfile(authUserId: string, data: UserUpdateBody): Promise<User> {
        const user = await this.userRepository.findById(authUserId); // Garante que o usuário existe
        if (!user) {
            throw new Error('User not found');
        }

        if(data.email){
            const userWithEmail = await this.userRepository.findByEmail(data.email);
            if (userWithEmail && userWithEmail.id !== authUserId) {
                throw new Error('Email already in use');
            }
        }

        if(data.password){
            data.password = await hash(data.password, 8);
        }

        const updatedUser = await this.userRepository.update(
            data, authUserId
        );
        return updatedUser;
    }

    async deactivateUser(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userRepository.deactivate(id);
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userRepository.delete(id);
    }
}