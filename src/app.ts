import fastify from 'fastify';

export const app = fastify();

// Aqui virão as rotas e configurações
app.get('/', () => {
  return { message: 'Bem-vindo à API TeamFlow!' };
});