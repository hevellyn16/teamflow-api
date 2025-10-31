import { FastifyRequest, FastifyReply } from "fastify";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({ error: 'Unauthorized' });
    }
}

type Role = 'DIRETOR' | 'COORDENADOR' | 'MEMBRO';
export function verifyUserRole(allowedRoles: Role | Role[]) {
    const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    return async (request: FastifyRequest, reply: FastifyReply) => {

        const userPayload = request.user as { sub: string; role: Role; iat: number; exp: number };

        if (!userPayload || !userPayload.role) {
            return reply.status(401).send({ message: 'Unauthorized: Role information is missing.' });
        }

        const userRole = userPayload.role;

        if (!rolesToCheck.includes(userRole)) {
            return reply.status(403).send({ error: 'Forbidden: Insufficient permissions.' });
        }
    };
}