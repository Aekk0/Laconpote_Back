// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internals
import { update, create, findOneProduct, findAllProduct, deleteProduct } from "./product.controller";
import productSchema from "./schema/product.json";
import pictureSchema from "../picture/schema/picture.json";
import productWithPictureSchema from "./schema/product-with-picture.json";
import routeSchema from "./schema/route.json";


export default async function api(server: FastifyInstance): Promise<void> {
    server.addSchema(pictureSchema);
    server.addSchema(productSchema);
    server.addSchema(productWithPictureSchema);

    server.patch("/:id", {
        schema: routeSchema.patch
    }, update);

    server.post("/", {
        schema: routeSchema.post
    }, create);

    server.get("/:id", {
        schema: routeSchema.findById
    }, findOneProduct);

    server.get("/", {
        schema: routeSchema.findAll
    }, findAllProduct);

    server.delete("/:id", {
        schema: routeSchema.delete
    }, deleteProduct);
}

export const autoPrefix = "/product";