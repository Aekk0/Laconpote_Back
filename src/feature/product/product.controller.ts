// Import Third-party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";

// Import Internals
import * as Entities from "../../entities/index";
import productSchema from "./schema/product.json";
import { PatchOptions } from "../../plugin/default.plugin";

export type PostRequest = FastifyRequest<{
    Body: Partial<Entities.Product>
}>;
  
export async function create(req: PostRequest, reply: FastifyReply): Promise<Entities.Product> {
    const manager = req.server.dataSource.manager;

    const { pictures, ...product } = req.body;
    
    const createdPictures = [];

    for (const picture of pictures) {
        const newPicture = manager.create(Entities.Picture, picture);
        await manager.save(Entities.Picture, newPicture);

        createdPictures.push(newPicture);
    }

    const newProduct = manager.create(Entities.Product, { 
        ...product,
        price: Number(product.price),
        pictures: createdPictures 
    });

    const { id } = await manager.save(Entities.Product, newProduct);

    const savedProduct = await manager.findOneBy(Entities.Product, { id });

    reply.statusCode = 201;

    return savedProduct;
}

export type PatchRequest = FastifyRequest<{
    Params: {
      id: string;
    };
    Body: Array<any>;
}>;
  
export async function update(req: PatchRequest): Promise<Entities.Product> {
    const manager = req.server.dataSource.manager;

    const foundProduct = await manager.findOne(Entities.Product, {
        where: {
            id: req.params.id
        }
    });

    const patchOptions: PatchOptions = {
        throwOnForbiddenPath: true,
        forbiddenPaths: ["/id"],
        schema: productSchema
    };

    const patchedProduct = req.server.applyJsonPatch({ ...foundProduct, price: Number(foundProduct.price) }, req.body, patchOptions);
    
    const newProduct = manager.create(Entities.Product, patchedProduct);
    const updatedProduct = await manager.save(Entities.Picture, newProduct);

    return updatedProduct;
}

export async function findAllProduct(req: FastifyRequest): Promise<Entities.Product[]> {
    const manager = req.server.dataSource.manager;

    const findProducts = await manager.find(Entities.Product, {
        relations: {
            pictures: true
        }
    });

    return findProducts;
}

export type FindOneRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

export async function findOneProduct(req: FindOneRequest, reply: FastifyReply): Promise<Entities.Product> {
    const manager = req.server.dataSource.manager;

    const findProduct = await manager.findOne(Entities.Product, {
        where: {
            id: req.params.id
        },
        relations: {
            pictures: true
        }
    });

    if (findProduct === null) {
        return reply.status(404).send({ message: "Product Does Not Exist" });
    }

    return findProduct;
}

export type DeleteProductRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

export async function deleteProduct(req: DeleteProductRequest, reply: FastifyReply) {
    const manager = req.server.dataSource.manager;
    
    const deleteResult = await manager.delete(Entities.Product,{
            id: req.params.id
    });

    if (deleteResult.affected === 0) {
        return reply.status(404).send({ message: "Product Does Not Exist" });
    }

    return reply.status(204).send();
}