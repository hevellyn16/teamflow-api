import type { FastifyInstance } from "fastify";
import { userRoutes } from "./userRoutes";

export function routes(app: FastifyInstance) {
  app.register(userRoutes);
}