import fastify from 'fastify';
import { routes } from './routes/routes';

const app = fastify();

app.register(routes);

export { app };