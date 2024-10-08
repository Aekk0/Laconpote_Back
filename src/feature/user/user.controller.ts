// Import Node.js
import crypto from "node:crypto";

// Import Third-party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";

// Import Internals
import * as Entities from "../../entities/index";
import userSchema from "./schema/user.json";
import { PatchOptions } from "../../plugin/default.plugin";

export type PostRequest = FastifyRequest<{
    Body: Partial<Entities.User>;
}>;
  
export async function create(req: PostRequest, reply: FastifyReply): Promise<Entities.User> {
    const manager = req.server.dataSource.manager;

    const hex = crypto.createHash("sha256").update(req.body.password.trim().replace(/\\/g, "\\\\")).digest("hex");
    const hashedPassword = Buffer.from(hex).toString("base64");

    const newUser = manager.create(Entities.User, { ...req.body, password: hashedPassword });
    const { id } = await manager.save(Entities.User, newUser);

    const savedUser = await manager.findOneBy(Entities.User, { id });

    delete savedUser.password;

    reply.statusCode = 201;

    return savedUser;
}
  
export type PatchRequest = FastifyRequest<{
    Params: {
      id: string;
    };
    Body: Array<any>;
}>;
  
export async function update(req: PatchRequest): Promise<Entities.User> {
    const manager = req.server.dataSource.manager;

    const foundUser = await manager.findOne(Entities.User, {
        where: {
            id: Number(req.params.id)
        }
    });

    const patchOptions: PatchOptions = {
        throwOnForbiddenPath: true,
        forbiddenPaths: ["/id"],
        schema: userSchema
    };

    const patchedUser = req.server.applyJsonPatch(foundUser, req.body, patchOptions);

    const newUser = manager.create(Entities.User, patchedUser);
    const updatedUser = await manager.save(Entities.User, newUser);

    const { id, password, ...user } = updatedUser;

    return user;
}

export type UpdateUserDataRequest = FastifyRequest<{
    Body: Array<any>;
}>;
  
export async function updateUserData(req: UpdateUserDataRequest): Promise<Entities.User> {
    const manager = req.server.dataSource.manager;

    const foundUser = await manager.findOne(Entities.User, {
        where: {
            id: Number(req.tokenInfo.id)
        }
    });

    const patchOptions: PatchOptions = {
        throwOnForbiddenPath: true,
        forbiddenPaths: ["/id"],
        schema: userSchema
    };

    const patchedUser = req.server.applyJsonPatch(foundUser, req.body, patchOptions);

    const newUser = manager.create(Entities.User, patchedUser);
    const updatedUser = await manager.save(Entities.User, newUser);

    const { id, password, ...user } = updatedUser;

    return user;
}

export async function findAll(req: FastifyRequest): Promise<Entities.User[]> {
    const manager = req.server.dataSource.manager;

    const findUsers = await manager.find(Entities.User, {
        relations: {
            addresses: true,
            orders: true
        }
    });

    return findUsers.map((user) => {
        delete user.password;

        return user;
    });
}

export type FindOneRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

export async function findOneUser(req: FindOneRequest, reply: FastifyReply): Promise<Entities.User> {
    const manager = req.server.dataSource.manager;

    const findUser = await manager.findOne(Entities.User, {
        where: {
            id: Number(req.params.id)
        },
        relations: {
            addresses: true
        }
    });

    if (findUser === null) {
        return reply.status(404).send({ message: "User Does Not Exist" });
    }

    delete findUser.password;

    return findUser;
}

export async function getUserData(req: FastifyRequest, reply: FastifyReply): Promise<Entities.User> {
    const manager = req.server.dataSource.manager;

    const findUser = await manager.findOne(Entities.User, {
        where: {
            id: Number(req.tokenInfo.id)
        },
        relations: {
            addresses: true
        }
    });

    if (findUser === null) {
        return reply.status(404).send({ message: "User Does Not Exist" });
    }

    delete findUser.password;

    return findUser;
}

export type DeleteUserRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

export async function deleteUser(req: DeleteUserRequest, reply: FastifyReply) {
    const manager = req.server.dataSource.manager;
    
    const deleteResult = await manager.delete(Entities.User,{
        id: req.params.id
    });

    if (deleteResult.affected === 0) {
        return reply.status(404).send({ message: "User Does Not Exist" });
    }

    return deleteResult;
}
