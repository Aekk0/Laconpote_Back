// Import third-party dependencies
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { CookieSerializeOptions } from "@fastify/cookie";
import { createVerifier, createSigner, createDecoder, VerifierSync, SignerSync } from "fast-jwt";
import ms from "ms";

// Import Internal dependencies
import headerSchema from "../schema/auth-header.schema.json";
import { role } from "../entities";

// CONSTANTS
const kRefreshDelayInSeconds = 120;

const cookieSerializeOptions: CookieSerializeOptions = Object.freeze({
    secure: true, httpOnly: true, sameSite: "none", path: "/"
});
const cookieName = Object.freeze({
    access: "laconpote-access-token",
    refresh: "laconpote-refresh-token"
});
let signToken: typeof SignerSync = null;
let verifyToken: typeof VerifierSync = null;
let verifyRefreshToken: typeof VerifierSync = null;
let signRefreshToken: typeof SignerSync = null;

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

interface Cookies {
    [cookieName: string]: string;
}

function getCookieToken(cookies: Cookies) {
    return cookies["myu-access-token"];
}

function getToken(this: FastifyRequest): string {
    return getCookieToken(this.cookies) || getAuthorizationToken(this.headers.authorization);
}

async function checkAuthentication(request: FastifyRequest, reply: FastifyReply) {
    const token = request.getToken();

    const tokenInfo: Token & Record<string, any> = await verifyToken(token);

    request.tokenInfo = tokenInfo;

    /**
     * Automatically refresh tokens if the access token is expiring in less than 120 seconds
     * Note: UNIX EPOCH for JWT are in seconds (not in milliseconds).
     */
    const now = new Date().getTime() / 1000;
    if ("exp" in tokenInfo
    && (tokenInfo.exp - now) < kRefreshDelayInSeconds
    && (cookieName.refresh in request.cookies)
    ) {
        const refreshTokenFromCookies = request.cookies[cookieName.refresh];
        const refreshTokenInfo = await verifyRefreshToken(refreshTokenFromCookies);

        delete refreshTokenInfo.exp;
        delete refreshTokenInfo.iat;

        const [accessToken, refreshToken] = await Promise.all([
            signToken(refreshTokenInfo),
            signRefreshToken(refreshTokenInfo)
        ]);

        reply.setCookie(cookieName.access, accessToken, {
            ...cookieSerializeOptions, maxAge: ms(process.env.jwt_expiration) / 1000
        });

        reply.setCookie(cookieName.refresh, refreshToken, {
            ...cookieSerializeOptions, maxAge: ms(process.env.jwt_refresh_expiration) / 1000
        });
    }
}

async function authentication(server: FastifyInstance) {
    server.addSchema(headerSchema);

    server.decorateRequest("getToken", getToken);

    server.addHook("onReady", () => {
        signToken = createSigner({
            key: process.env.jwt_secret,
            expiresIn: ms(process.env.jwt_expiration)
        });

        verifyToken = createVerifier({
            key: process.env.jwt_secret,
            cache: 1000
        });
        
        signRefreshToken = createSigner({
            key: process.env.jwt_refresh_secret,
            expiresIn: ms(process.env.jwt_refresh_expiration)
        });

        verifyRefreshToken = createVerifier({
            key: process.env.jwt_refresh_secret
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
  