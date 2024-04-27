// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internals
import { update, create, findOnePicture, deletePicture } from "./picture.controller";
import pictureSchema from "./schema/picture.json";

export default async function api(server: FastifyInstance): Promise<void> {
    
    server.addSchema(pictureSchema);

    server.patch("/:id", {
        // schema: routeSchema.patch,
    }, update);

    server.post("/", {
        // schema: routeSchema.post
    }, create);

    server.get("/:id", {
        // schema: routeSchema.findById
    }, findOnePicture);

    // server.get("/", {
    //     // schema: routeSchema.findAll
    // }, findAllByProduct);

    server.delete("/:id", {
        // schema: routeSchema.delete
    }, deletePicture);
}

export const autoPrefix = "/picture";