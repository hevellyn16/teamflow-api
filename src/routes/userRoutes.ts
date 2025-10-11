import type { FastifyInstance } from "fastify";
import { UserController } from "../controller/UserController";
import { authMiddleware, verifyUserRole } from "../middlewares/auth";

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController();
  
  //Acesso restrito: apenas diretor
  app.post('/users', {onRequest: [authMiddleware, verifyUserRole('DIRETOR')]}, userController.createUser);
  app.get('/users', { onRequest:[authMiddleware, verifyUserRole('DIRETOR')] }, userController.getAllUsers);
  app.get('/users/:id', { onRequest:[authMiddleware, verifyUserRole('DIRETOR')] }, userController.getUserById);
  app.get('/users/account', { onRequest:[authMiddleware, verifyUserRole('DIRETOR')] }, userController.updateUser);


  //Qualquer usuário autenticado
  app.post('/sessions', userController.authenticate);
  app.put('/profile', { onRequest: [authMiddleware]}, userController.updateProfile);
}