// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internals
import { authenticationPlugin } from "../../plugin/auth.plugin";
import {
    create,
    deleteById,
    update,
    findAllByUser
} from "./address.controller";

export default async function api(server: FastifyInstance): Promise<void> {
    server.register(authenticationPlugin);

    server.get("/", findAllByUser);

    server.patch("/:id", update);
    server.post("/", create);

    server.delete("/:id", deleteById);
}

export const autoPrefix = "/address";