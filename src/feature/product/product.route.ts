// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internals
import { create } from "./product.controller";


export default async function api(server: FastifyInstance): Promise<void> {
    // server.addSchema(userSchema);

    // server.register(authenticationPlugin);

    // server.patch("/:id", {
    //     schema: routeSchema.patch,
    // }, update);

    server.post("/", create);

    // server.get("/:id", {
    //     schema: routeSchema.findById
    // }, findOneUser);

    // server.get("/", {
    //     schema: routeSchema.findAll
    // }, findAll);

    // server.delete("/:id", {
    //     schema: routeSchema.delete
    // }, deleteUser);
}

export const autoPrefix = "/product";