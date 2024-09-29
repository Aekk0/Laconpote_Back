// Import Third-party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";

// Import Internals
import * as Entities from "../../entities/index";
import orderSchema from "./schema/order.json";
import { PatchOptions } from "../../plugin/default.plugin";

export type PostRequest = FastifyRequest<{
    Body: Partial<Entities.Order>
}>;

export async function create(req: PostRequest, reply: FastifyReply): Promise<Entities.Order> {
    const manager = req.server.dataSource.manager;

    const { products, ...order } = req.body;
    const userId = req.tokenInfo.id;

    const allProducts = await manager.find(Entities.Product);

    const relatedProducts = allProducts.filter((dbproduct) => 
        products.some((product) => dbproduct.id === product.id)
    );

    const newOrder = manager.create(Entities.Order, { 
        ...order,
        price: 0,
        user_id: Number(userId),
        products: relatedProducts
    } as any);

    const { id } = await manager.save(Entities.Order, newOrder);

    const savedOrder = await manager.findOneBy(Entities.Order, { id });

    reply.statusCode = 201;

    return savedOrder;
}

export async function findAll(req: FastifyRequest): Promise<Entities.Order[]> {
    const manager = req.server.dataSource.manager;

    const orders = await manager.find(Entities.Order, {
        relations: {
            products: true
        }
    });

    return orders;
}

export async function findAllByUser(req: FastifyRequest): Promise<Entities.Order[]> {
    const manager = req.server.dataSource.manager;

    const userId = req.tokenInfo.id;

    const addresses = await manager.find(Entities.Order, {
        where: {
            user_id: Number(userId)
        },
        relations: {
            products: true
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

export async function update(req: PatchRequest): Promise<Entities.Order> {
    const manager = req.server.dataSource.manager;

    const userId = req.tokenInfo.id;

    const foundOrder = await manager.findOne(Entities.Order, {
        where: {
            id: req.params.id,
            user_id: Number(userId)
        }
    });

    const patchOptions: PatchOptions = {
        throwOnForbiddenPath: true,
        forbiddenPaths: ["/id"],
        schema: orderSchema
    };

    const patchedOrder = req.server.applyJsonPatch({ ...foundOrder }, req.body, patchOptions);
    
    const newOrder = manager.create(Entities.Product, patchedOrder);
    const updatedOrder = await manager.save(Entities.Picture, newOrder);

    return updatedOrder;
}

export type DeleteRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

export async function deleteById(req: DeleteRequest, reply: FastifyReply) {
    const manager = req.server.dataSource.manager;

    const userId = req.tokenInfo.id;
    
    const deleteResult = await manager.delete(Entities.Order, {
        id: req.params.id,
        user_id: Number(userId)
    });

    if (deleteResult.affected === 0) {
        return reply.status(404).send({ message: "Order Does Not Exist" });
    }

    return reply.status(204).send();
}