// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

export default async function api(server: FastifyInstance): Promise<void> {
    server.post("/", { schema: { tags: ["user"] } }, async() => {
        console.log("bar");

        return;
    });
}

export const autoPrefix = "/user";