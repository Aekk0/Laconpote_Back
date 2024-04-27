// Import Third-party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";

// Import Internals
import * as Entities from "../../entities/index";
import { PatchOptions } from "../../plugin/default.plugin";
import pictureSchema from "./schema/picture.json";

export type PostRequest = FastifyRequest<{
    Body: Partial<Entities.Picture>
}>;
  
export async function create(req: PostRequest, reply: FastifyReply): Promise<Entities.Picture> {
    const manager = req.server.dataSource.manager;

    const newPicture = manager.create(Entities.Picture, req.body);
    const { id } = await manager.save(Entities.Picture, newPicture);

    const savedPicture = await manager.findOneBy(Entities.Picture, { id });

    reply.statusCode = 201;

    return savedPicture;
}
  
export type PatchRequest = FastifyRequest<{
    Params: {
      id: string;
    };
    Body: Array<any>;
}>;
  
export async function update(req: PatchRequest): Promise<Entities.Picture> {
    const manager = req.server.dataSource.manager;

    const foundPicture = await manager.findOne(Entities.Picture, {
        where: {
            id: req.params.id
        }
    });

    const patchOptions: PatchOptions = {
        throwOnForbiddenPath: true,
        forbiddenPaths: ["/id"],
        schema: pictureSchema
    };

    const patchedPicture = req.server.applyJsonPatch(foundPicture, req.body, patchOptions);

    const newPicture = manager.create(Entities.Picture, patchedPicture);
    const updatedPicture = await manager.save(Entities.Picture, newPicture);

    return updatedPicture;
}

export type FindAllByProductRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

// export async function findAllByProduct(req: FindAllByProductRequest): Promise<Entities.Picture[]> {
//     const manager = req.server.dataSource.manager;

//     const findPictures = await manager.find(Entities.Picture, { 
//         where: {
//             product_id: req.params.id
//         }
//     });

//     return findPictures;
// }

export type FindOneRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

export async function findOnePicture(req: FindOneRequest, reply: FastifyReply): Promise<Entities.Picture> {
    const manager = req.server.dataSource.manager;

    const findPicture = await manager.findOne(Entities.Picture, {
        where: {
            id: req.params.id
        }
    });

    if (findPicture === null) {
        return reply.status(404).send({ message: "Picture Does Not Exist" });
    }

    return findPicture;
}

export type DeletePictureRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

export async function deletePicture(req: DeletePictureRequest, reply: FastifyReply) {
    const manager = req.server.dataSource.manager;
    
    const deleteResult = await manager.delete(Entities.Picture,{
            id: req.params.id
    });

    if (deleteResult.affected === 0) {
        return reply.status(404).send({ message: "Picture Does Not Exist" });
    }

    return deleteResult;
}