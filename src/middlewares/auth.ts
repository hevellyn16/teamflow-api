import { FastifyRequest, FastifyReply } from "fastify";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({ error: 'Unauthorized' });
    }
}

export function verifyUserRole(roleToVerify: 'DIRETOR' | 'COORDENADOR' | 'MEMBRO') {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const { role } = (request.user as { role?: string });
        if (role !== roleToVerify) {
            return reply.status(403).send({ error: 'Forbidden' });
        }
    }
}