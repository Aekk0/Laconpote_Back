// Import Third-party Dependencies
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

async function checkRole(request: FastifyRequest, reply: FastifyReply) {
    if (request.tokenInfo.role === "user") {
        reply.status(401).send({
            statusCode: reply.statusCode,
            message: "Unauthorized"
        });
    }

    return;
}

async function isAdmin(server: FastifyInstance) {
    server.addHook("preHandler", checkRole);
}

export const isAdminPlugin: FastifyPluginAsync = fp(isAdmin, {
    name: "isAdmin",
    fastify: "4.x"
});
