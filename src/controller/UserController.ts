import type { FastifyReply, FastifyRequest } from "fastify";
import {UserCreateBodySchema, UserCreateBody} from "../dto/user/UserCreateBodySchema";
import { UserService } from "../service/UserService";
import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";
import { AuthUserService } from "../service/AuthUserService";
import z from "zod";
import { UserUpdateBodySchema } from "../dto/user/UserUpdateBodySchema";

export class UserController {
    private readonly userService = new UserService(new PrismaUserRepository()); 

    createUser = async (request: FastifyRequest, reply: FastifyReply) => {
        const body = UserCreateBodySchema.parse(request.body);
        const user = await this.userService.createUser(body);
        return reply.status(201).send(user);
        
    }

    getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
        const users = await this.userService.getAllUsers();
        return reply.status(200).send(users);
    };
    
    authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
        const authenticateBodySchema = z.object({
            email: z.email(),
            password: z.string().min(6),
        });
    
        const { email, password } = authenticateBodySchema.parse(request.body);
    
        try{
            const usersRepository = new PrismaUserRepository();
    
            const authService = new AuthUserService(usersRepository, request.server);
            const { token } = await authService.execute({ email, password });
            return reply.status(200).send({ token });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Authentication failed";
            return reply.status(401).send({ error: errorMessage });
        }
    }

    getUserById = async (request: FastifyRequest, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const user = await this.userService.getUserById(id);
        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }
        return reply.status(200).send(user);
    };

    getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
        const user = request.user as { sub?: string } | undefined;
        const authUserId = user?.sub;
        if (!authUserId) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
        try {
            const user = await this.userService.getUserById(authUserId);
            return reply.status(200).send(user);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Fetch profile failed";
            return reply.status(400).send({ error: errorMessage });
        }
    };

    getUserByEmail = async (request: FastifyRequest, reply: FastifyReply) => {
        const user = request.user as { sub?: string } | undefined;
        const authUserId = user?.sub;
        if (!authUserId) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
        try {
            const user = await this.userService.getUserById(authUserId);
            return reply.status(200).send(user);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Fetch profile failed";
            return reply.status(400).send({ error: errorMessage });
        }
    };

    updateProfile = async (request: FastifyRequest, reply: FastifyReply) => {
        const user = request.user as { sub?: string } | undefined;
        const authUserId = user?.sub;
        if (!authUserId) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
        const data = UserUpdateBodySchema.parse(request.body);
        try {
            const updatedUser = await this.userService.updateUser(authUserId, data);
            return reply.status(200).send(updatedUser);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Update failed";
            return reply.status(400).send({ error: errorMessage });
        }
    };

    updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const updateBodySchema = z.object({
            name: z.string().min(3).optional(),
            email: z.email().optional(),
            password: z.string().min(6).optional(),
            role: z.enum(["DIRETOR", "COORDENADOR", "MEMBRO"]).optional(),
            isActive: z.boolean().optional(),
        });

        const data = updateBodySchema.parse(request.body);

        try {
            const updatedUser = await this.userService.updateUser(id, data);
            return reply.status(200).send(updatedUser);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Update failed";
            return reply.status(400).send({ error: errorMessage });
        }
    };

    deactivateUser = async (request: FastifyRequest, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        try {
            await this.userService.deactivateUser(id);
            return reply.status(204).send();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Deactivation failed";
            return reply.status(400).send({ error: errorMessage });
        }
    };

    deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
        const paramsSchema = z.object({
            id: z.uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        try {
            await this.userService.deleteUser(id);
            return reply.status(204).send();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Delete failed";
            return reply.status(400).send({ error: errorMessage });
        }
    };
}
