// Import Third-party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";

// Import Internals
import * as Entities from "../../entities/index";

export type PostRequest = FastifyRequest<{
    Body: Partial<Entities.Product>
}>;
  
export async function create(req: PostRequest, reply: FastifyReply): Promise<Entities.Product> {
    const manager = req.server.dataSource.manager;

    const newProduct = manager.create(Entities.Product, req.body);
    const { id } = await manager.save(Entities.Product, newProduct);

    const savedProduct = await manager.findOneBy(Entities.Product, { id });

    reply.statusCode = 201;

    return savedProduct;
}

