// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internals
import { authenticationPlugin } from "../../plugin/auth.plugin";
import {
    create,
    deleteById,
    update,
    findAllByUser,
    findAll
} from "./order.controller";
import { isAdminPlugin } from "../../plugin/isAdmin.plugin";

export default async function api(server: FastifyInstance): Promise<void> {
    server.register(authenticationPlugin);

    server.get("/", findAllByUser);

    server.patch("/:id", update);
    server.post("/", create);

    server.delete("/:id", deleteById);

    server.register(guard);
}

async function guard(server: FastifyInstance): Promise<void> {
    server.register(isAdminPlugin);

    server.get("/all", findAll);
}

export const autoPrefix = "/order";
