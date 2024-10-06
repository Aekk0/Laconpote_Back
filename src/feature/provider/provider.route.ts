// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internals
import { authenticationPlugin } from "../../plugin/auth.plugin";
import {
    create,
    deleteById,
    findAll
} from "./provider.controller";
import { isAdminPlugin } from "../../plugin/isAdmin.plugin";

export default async function api(server: FastifyInstance): Promise<void> {
    server.register(authenticationPlugin);
    server.get("/", findAll);
    
    server.register(guard);
}

async function guard(server: FastifyInstance): Promise<void> {
    server.register(isAdminPlugin);
    
    server.post("/", create);
    
    server.delete("/:id", deleteById);
}

export const autoPrefix = "/provider";
