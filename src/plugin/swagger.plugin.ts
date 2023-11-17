// Import third-party dependencies
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import swagger from "@fastify/swagger";

export async function swaggerFn(server: FastifyInstance) {
    const swaggerOptions = {
        routePrefix: "/api/v1/documentation",
        staticCSP: true,
        exposeRoute: true,
        swagger: {
            info: {
                title: "Laconpote Swagger",
                description: "Laconpote Swagger API Documentation",
                version: "0.1.0"
            },
            host: "localhost",
            consumes: ["application/json"],
            produces: ["application/json"],
            tags: [
                { name: "user", description: "Endpoints to manager Users" },
                { name: "auth", description: "Endpoints to handle Auth" }
            ]
        },
        uiConfig: {
            defaultModelRendering: "model",
            docExpansion: "list",
            deepLinking: false,
            filter: true
        }
    };

    server.register(swagger, swaggerOptions);
}

export const swaggerPlugin: FastifyPluginAsync = fp(swaggerFn, { name: "swaggerPlugin" });
