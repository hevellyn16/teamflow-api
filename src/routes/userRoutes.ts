import type { FastifyInstance } from "fastify";
import { UserController } from "../controller/UserController";

export function userRoutes(app: FastifyInstance) {
  const userController = new UserController();
    
    app.post('/users', userController.createUser);
    app.get('/users', userController.getAllUsers);
    app.post('/sessions', userController.authenticate);
}