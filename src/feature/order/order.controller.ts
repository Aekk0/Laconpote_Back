// Import Third-party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";

// Import Internals
import * as Entities from "../../entities/index";
import orderSchema from "./schema/order.json";
import { PatchOptions } from "../../plugin/default.plugin";

export type OrderRequest = FastifyRequest<{
    Body: {
        address_id: number;
        provider_id: number;
        products: { id: number; quantity: number }[];  // Array of product IDs with quantities
        price?: number;  // Optional if you want to auto-calculate based on products
        dueDate?: Date;
    };
}>;

export async function create(req: OrderRequest, reply: FastifyReply): Promise<Entities.Order> {
    const manager = req.server.dataSource.manager;

    const { address_id, provider_id, products, dueDate } = req.body;
    const userId = req.tokenInfo.id;

    const address = await manager.findOne(Entities.Address, { where: { id: address_id } });
    const provider = await manager.findOne(Entities.Provider, { where: { id: provider_id } });

    const orderProducts = [];

    let totalOrderPrice = 0;

    for (const { id, quantity } of products) {
        const product = await manager.findOne(Entities.Product, { where: { id } });
        if (!product) continue;

        // Calculate total price if not provided
        totalOrderPrice += Number(product.price) * quantity;

        const orderProduct = manager.create(Entities.OrderProduct, {
            product,
            quantity
        });
        await manager.save(Entities.OrderProduct, orderProduct);

        orderProducts.push(orderProduct);
    }

    const newOrder = manager.create(Entities.Order, {
        user_id: Number(userId),
        address,
        provider,
        orderProducts,  // Attach order products
        price: totalOrderPrice,  // Use provided price or calculate it
        dueDate: dueDate || new Date()
    });

    const { id } = await manager.save(Entities.Order, newOrder);

    const savedOrder = await manager.findOneBy(Entities.Order, { id });

    reply.statusCode = 201;

    return savedOrder;
}

export async function findAll(req: FastifyRequest): Promise<Entities.Order[]> {
    const manager = req.server.dataSource.manager;

    const orders = await manager.find(Entities.Order, {
        relations: {
            orderProducts: { product: true },
            provider: true,
            address: true,
            user: true
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
            orderProducts: { product: true },
            address: true,
            provider: true,
            user: true
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