// Import Third-party Dependencies
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

// Import Internals
import { update, create, findOneUser, findAll, deleteUser } from "./user.controller";
import userSchema from "./schema/user.json";
import routeSchema from "./schema/route.json";
import { authenticationPlugin } from "../../plugin/auth.plugin";
import { isAdminPlugin } from "../../plugin/isAdmin.plugin";

export default async function api(server: FastifyInstance): Promise<void> {
    server.addSchema(userSchema);

    server.post("/", {
        schema: routeSchema.post
    }, create);

    server.register(guard);
    server.register(adminGuard);
}

async function guard(server: FastifyInstance): Promise<void> {
    server.register(authenticationPlugin);

    server.patch("/:id", {
        schema: routeSchema.patch,
    }, update);


    server.get("/:id", {
        schema: routeSchema.findById
    }, findOneUser);

    server.delete("/:id", {
        schema: routeSchema.delete
    }, deleteUser);
}

async function adminGuard(server: FastifyInstance): Promise<void> {
    server.register(authenticationPlugin);
    server.register(isAdminPlugin);

    server.get("/", {
        schema: routeSchema.findAll
    }, findAll); 
}

export const autoPrefix = "/user";