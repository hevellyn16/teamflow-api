import fastify from 'fastify';
import { routes } from './routes/routes';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'TeamFlow API',
            description: 'API simples para organização de equipes por Setor, com Projetos e Membros.', //
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: { 
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs', // Endereço da documentação: http://localhost:3000/docs
});

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
});

app.register(routes);

export { app };