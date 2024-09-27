// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internal Dependencies
import { checkout } from "./payment.controller";

export default async function api(server: FastifyInstance): Promise<void> {
    server.post("/checkout-session", checkout);
}

export const autoPrefix = "/payment";