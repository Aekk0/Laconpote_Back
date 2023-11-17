// Import Third-parties
import helmet from "@fastify/helmet";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

// Import Internals
import fastifyCors from "@fastify/cors";

export async function defaultFn(server: FastifyInstance) {
    server.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [`'self'`],
                styleSrc: [`'self'`, `'unsafe-inline'`],
                imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
                scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
            }
        }
    })
    server.register(fastifyCors, {
        credentials: true,
        origin: true
    });
}

export const defaultPlugin: FastifyPluginAsync = fp(defaultFn, { name: "defaultPlugin" });
