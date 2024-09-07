// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internals
import { update, deleteOne, deleteMany } from "./picture.controller";
import pictureSchema from "./schema/picture.json";
import routeSchema from "./schema/route.json";

export default async function api(server: FastifyInstance): Promise<void> {
    server.addSchema(pictureSchema);

    server.patch("/:id", {
        schema: routeSchema.patch
    }, update);

    server.delete("/:id", {
        schema: routeSchema.deleteOne
    }, deleteOne);

    server.delete("/", {
        schema: routeSchema.deleteMany
    }, deleteMany)
}

export const autoPrefix = "/picture";