// Import Third-party Dependencies
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import * as httpie from "@myunisoft/httpie";

// CONSTANTS
const paypalDomain = process.env.PAYPAL_URI ?? "https://api-m.sandbox.paypal.com";

async function generateAccessToken(request: FastifyRequest, reply: FastifyReply) {
    const BASE64_ENCODED_CLIENT_ID_AND_SECRET = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const postResult = await httpie.safePost(`${paypalDomain}/v1/oauth2/token`, {
        headers: {
            authorization: `Basic ${BASE64_ENCODED_CLIENT_ID_AND_SECRET}`
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            response_type: "id_token",
            intent: "sdk_init",
        })
    });

    if (postResult.ok) {
        request.paypalToken = postResult.unwrap().data["access_token"];

        return;
    }

    throw new Error(`Unable to connect to Paypal`);
}

async function paypalHandler(server: FastifyInstance) {
    server.addHook("preHandler", generateAccessToken);
}

declare module "fastify" {
    interface FastifyRequest {
      paypalToken: string;
    }
}

export const paypalReq: FastifyPluginAsync = fp(paypalHandler, {
    name: "paypalReq",
    fastify: "4.x"
});
