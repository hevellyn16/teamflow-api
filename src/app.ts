import fastify from 'fastify';
import { routes } from './routes/routes';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';

const app = fastify();

// Configura o Fastify para entender os schemas do Zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Registra o plugin principal do Swagger (gera a especificação OpenAPI)
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'TeamFlow API',
            description: 'API simples para organização de equipes por Setor, com Projetos e Membros.', //
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: { // Nome do esquema de segurança
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }], // Aplica a segurança JWT globalmente na UI
    },
    transform: jsonSchemaTransform, // Transforma os schemas Zod em JSON Schema para o OpenAPI
});

// Registra o plugin que gera a interface gráfica da documentação
app.register(fastifySwaggerUi, {
    routePrefix: '/docs', // Endereço da documentação: http://localhost:3000/docs
});

// Registra o plugin do JWT
app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
});

// Registra todas as suas rotas
app.register(routes);

export { app };