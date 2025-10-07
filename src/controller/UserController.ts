import type { FastifyReply, FastifyRequest } from "fastify";
import {UserCreateBodySchema, UserCreateBody} from "../dto/user/UserCreateBodySchema";
import { UserService } from "../service/UserService";
import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";
import { AuthUserService } from "../service/AuthUserService";
import z from "zod";

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
}
