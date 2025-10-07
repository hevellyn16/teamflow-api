import type { FastifyReply, FastifyRequest } from "fastify";
import {UserCreateBodySchema, UserCreateBody} from "../dto/user/UserCreateBodySchema";
import { UserService } from "../service/UserService";
import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";

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
}