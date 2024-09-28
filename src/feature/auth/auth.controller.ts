// Import Node.js
import crypto from "node:crypto";

// Import Third-Party
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ms from "ms";

// Import Internals
import * as Entities from "../../entities/index";
import { Token } from "../../plugin/auth.plugin";

dayjs.extend(utc);

export interface AuthenticateRoute extends RouteGenericInterface {
    Body: {
        email: string;
        password: string;
        includeUserData?: boolean;
    }
  }

export async function authenticate(req: FastifyRequest<AuthenticateRoute>, reply: FastifyReply) {
    const { email, password, includeUserData } = req.body;

    const manager = req.server.dataSource.manager;

    const foundUser = await manager.findOne(Entities.User, {
        where: {
            email
        },
        relations: {
            addresses: true
        }
    });

    if (!foundUser) {
        reply.status(401).send({ message: "Unable to authenticate!" });
    }

    const hex = crypto.createHash("sha256").update(password.trim().replace(/\\/g, "\\\\")).digest("hex");
    const hashedPassword = Buffer.from(hex).toString("base64");

    if (hashedPassword !== foundUser.password) {
        reply.status(401).send({ message: "Unable to authenticate!" });
    }

    const bearerTokenPayload: Token = {
        id: foundUser.id.toString(),
        role: foundUser.role
    };

    const accessToken = jwt.sign(bearerTokenPayload, process.env.jwt_secret, {
        expiresIn: process.env.jwt_expiration
    });

    const refreshToken = jwt.sign(bearerTokenPayload, process.env.jwt_refresh_secret, {
        expiresIn: process.env.jwt_refresh_expiration
    });

    return {
        expireIn: dayjs().utc().add(ms(process.env.jwt_expiration) / 1000, "s").format("YYYY-MM-DD HH:mm:ss"),
        accessToken,
        refreshToken,
        tokenType: "bearer",
        userData: includeUserData ? { ...foundUser, password: null } : null
    }
}