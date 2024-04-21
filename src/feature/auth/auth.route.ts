// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internal Dependencies
import { authenticate } from "./auth.controller";

export default async function api(server: FastifyInstance): Promise<void> {
    server.post("/", { schema: { tags: ["auth"] } }, authenticate);
}

export const autoPrefix = "/auth";