// Import Third-party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";

// Import Internals
import * as Entities from "../../entities/index";
import addressSchema from "./schema/address.json";
import { PatchOptions } from "../../plugin/default.plugin";

export type PostRequest = FastifyRequest<{
    Body: Partial<Entities.Address>
}>;

export async function create(req: PostRequest, reply: FastifyReply): Promise<Entities.Address> {
    const manager = req.server.dataSource.manager;

    const { ...address } = req.body;
    const userId = req.tokenInfo.id;
    
    const newAddress = manager.create(Entities.Address, { 
        ...address,
        user_id: Number(userId)
    });

    const { id } = await manager.save(Entities.Address, newAddress);

    const savedAddress = await manager.findOneBy(Entities.Address, { id });

    reply.statusCode = 201;

    return savedAddress;
}

export async function findAllByUser(req: FastifyRequest): Promise<Entities.Address[]> {
    const manager = req.server.dataSource.manager;

    const userId = req.tokenInfo.id;

    const addresses = await manager.find(Entities.Address, {
        where: {
            user_id: Number(userId)
        }
    });

    return addresses;
}

export type PatchRequest = FastifyRequest<{
    Params: {
        id: string;
    };
    Body: Array<any>;
}>;

export async function update(req: PatchRequest): Promise<Entities.Address> {
    const manager = req.server.dataSource.manager;

    const userId = req.tokenInfo.id;

    const foundAddress = await manager.findOne(Entities.Address, {
        where: {
            id: Number(req.params.id),
            user_id: Number(userId)
        }
    });

    const patchOptions: PatchOptions = {
        throwOnForbiddenPath: true,
        forbiddenPaths: ["/id"],
        schema: addressSchema
    };

    const patchedAddress = req.server.applyJsonPatch({ ...foundAddress }, req.body, patchOptions);
    
    const newAddress = manager.create(Entities.Product, patchedAddress);
    const updatedAddress = await manager.save(Entities.Picture, newAddress);

    return updatedAddress;
}

export type DeleteRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

export async function deleteById(req: DeleteRequest, reply: FastifyReply) {
    const manager = req.server.dataSource.manager;

    const userId = req.tokenInfo.id;
    
    const deleteResult = await manager.delete(Entities.Address, {
        id: req.params.id,
        userId: Number(userId)
    });

    if (deleteResult.affected === 0) {
        return reply.status(404).send({
            message: "Address Does Not Exist"
        });
    }

    return reply.status(204).send();
}
