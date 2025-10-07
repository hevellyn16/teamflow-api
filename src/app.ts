import fastify from 'fastify';
import { routes } from './routes/routes';
import { env } from './env';

const app = fastify();

app.register(routes);
app.register(require('@fastify/jwt'), {
    secret: env.JWT_SECRET,
});

export { app };