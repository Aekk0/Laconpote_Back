// Import third-party dependencies
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { createVerifier, VerifierSync } from "fast-jwt";

// Import Internal dependencies
import headerSchema from "../schema/auth-header.schema.json";
import { role } from "../entities";

let verifyToken: typeof VerifierSync = null;

export interface Token {
    id: string;
    role: role;
}

function getAuthorizationToken(authorization: string) {
    if (authorization) {
      const [type, credentials] = authorization.split(" ");
      if (type === "Bearer" && credentials) {
        return credentials;
      }
    }
  
    return "";
}

function getToken(this: FastifyRequest): string {
    return getAuthorizationToken(this.headers.authorization);
}

async function checkAuthentication(request: FastifyRequest) {
    const token = request.getToken();

    const tokenInfo: Token & Record<string, any> = await verifyToken(token);

    request.tokenInfo = tokenInfo;
}

async function authentication(server: FastifyInstance) {
    server.addSchema(headerSchema);

    server.decorateRequest("getToken", getToken);

    server.addHook("onReady", () => {
        verifyToken = createVerifier({
            key: process.env.jwt_secret,
            cache: 1000
        });
    });

    server.addHook("preHandler", checkAuthentication);
}
  
declare module "fastify" {
    interface FastifyRequest {
      tokenInfo: Token;
      getToken: () => string;
    }
}

export const authenticationPlugin: FastifyPluginAsync = fp(authentication, {
    name: "authentication",
    fastify: "4.x"
});
  