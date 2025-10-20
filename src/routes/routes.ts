import type { FastifyInstance } from "fastify";
import { userRoutes } from "./userRoutes";
import { sectorRoutes } from "./sectorRoutes";
import { projectRoutes } from "./projectRoutes";

export function routes(app: FastifyInstance) {
  app.register(userRoutes);
  app.register(sectorRoutes);
  app.register(projectRoutes);
}