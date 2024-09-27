// Import Third-party Dependencies
import { FastifyInstance } from "fastify";

// Import Internal Dependencies
// import { checkout } from "./payment.controller";
import { paypalReq } from "../../plugin/paypal.plugin";
import { captureOrder, createOrder } from "./payment.controller";

export default async function api(server: FastifyInstance): Promise<void> {
    server.register(paypalReq);
    
    // server.post("/checkout-session", checkout);
    server.post("/orders", createOrder);
    server.post("/orders/:orderID/capture", captureOrder);
}

export const autoPrefix = "/payment";