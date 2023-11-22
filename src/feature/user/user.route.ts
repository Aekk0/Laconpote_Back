// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internals
import { update, create, findOneUser, findAll, deleteUser } from "./user.controller";
import userSchema from "./schema/user.json";
import routeSchema from "./schema/route.json";
import { authenticationPlugin } from "../../plugin/auth.plugin";

export default async function api(server: FastifyInstance): Promise<void> {
    server.addSchema(userSchema);

    // server.register(authenticationPlugin);

    server.patch("/:id", {
        schema: routeSchema.patch,
    }, update);

    server.post("/", {
        schema: routeSchema.post
    }, create);

    server.get("/:id", {
        schema: routeSchema.findById
    }, findOneUser);

    server.get("/", {
        schema: routeSchema.findAll
    }, findAll);

    server.delete("/:id", {
        schema: routeSchema.delete
    }, deleteUser);
}

export const autoPrefix = "/user";