// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

export default async function api(server: FastifyInstance): Promise<void> {
    server.post("/", { schema: { tags: ["auth"] } }, async() => {
        console.log("foo");

        return;
    });
}

export const autoPrefix = "/auth";