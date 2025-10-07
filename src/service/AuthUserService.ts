import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";
import  { FastifyInstance } from "fastify";
import "@fastify/jwt";

interface AuthRequest {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
}

export class AuthUserService {
    constructor(private readonly userRepository: PrismaUserRepository, private app: FastifyInstance) {}


    async execute({ email, password }: AuthRequest): Promise<AuthResponse> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('E-mail inválido!');
        }

        

        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Senha inválida!');
        }

        const token = await this.app.jwt.sign({
            name: user.name,
            email: user.email,
            role: user.role,
        }, {
            sub: user.id,
            expiresIn: '7 days'
        });

        return { token };
    }
}