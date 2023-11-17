// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internals
import { update, create } from "./user.controller";
import userSchema from "./schema/user.json";
import routeSchema from "./schema/route.json";

export default async function api(server: FastifyInstance): Promise<void> {
    server.addSchema(userSchema);

    server.patch("/:id", {
        schema: routeSchema.patch,
    }, update);

    server.post("/", {
        schema: routeSchema.post
    }, create);
}

export const autoPrefix = "/user";