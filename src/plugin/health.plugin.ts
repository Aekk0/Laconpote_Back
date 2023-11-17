// Import third-party dependencies
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

export async function healthCheck(server: FastifyInstance) {
    const path = "/api/v1/health";
    const version = "1.0.0";
    const description = "Service Laconpote";

    server.get(path, { logLevel: "error" }, async function getHealth(req) {
        return {
            status: "pass",
            version,
            description,
            uptime: process.uptime()
        };
    });
}

export const healthPlugin: FastifyPluginAsync = fp(healthCheck, { name: "healthPlugin" });
