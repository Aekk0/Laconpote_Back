// Import Third-party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";

// Import Internals
import * as Entities from "../../entities/index";

export type OrderRequest = FastifyRequest<{
    Body: {
        price: number[];
        name: string;
    }
}>;

export async function create(req: OrderRequest, reply: FastifyReply): Promise<Entities.Provider> {
    const manager = req.server.dataSource.manager;

    const { price, name } = req.body;


    const newProvider = manager.create(Entities.Provider, {
        price,
        name
    });

    const { id } = await manager.save(Entities.Provider, newProvider);

    const savedProvider = await manager.findOneBy(Entities.Provider, { id });

    reply.statusCode = 201;

    return savedProvider;
}

export async function findAll(req: FastifyRequest): Promise<Entities.Provider[]> {
    const manager = req.server.dataSource.manager;

    const providers = await manager.find(Entities.Provider);

    return providers;
}

export type DeleteRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

export async function deleteById(req: DeleteRequest, reply: FastifyReply) {
    const manager = req.server.dataSource.manager;
    
    const deleteResult = await manager.delete(Entities.Provider, {
        id: req.params.id
    });

    if (deleteResult.affected === 0) {
        return reply.status(404).send({ message: "Order Does Not Exist" });
    }

    return reply.status(204).send();
}