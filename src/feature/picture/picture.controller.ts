// Import Third-party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";

// Import Internals
import * as Entities from "../../entities/index";
import { PatchOptions } from "../../plugin/default.plugin";
import pictureSchema from "./schema/picture.json";
 
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

export type DeleteOneRequest = FastifyRequest<{
    Params: {
      id: string;
    };
}>;

export async function deleteOne(req: DeleteOneRequest, reply: FastifyReply) {
    const manager = req.server.dataSource.manager;
    
    const deleteResult = await manager.delete(Entities.Picture,{
            id: req.params.id
    });

    if (deleteResult.affected === 0) {
        return reply.status(404).send({ message: "Picture doesn't exist" });
    }

    return deleteResult;
}

export type DeleteManyRequest = FastifyRequest<{
    Body: {
      ids: string[];
    };
}>;

export async function deleteMany(req: DeleteManyRequest, reply: FastifyReply) {
    const manager = req.server.dataSource.manager;
  
    const deleteResults = await manager.delete(Entities.Picture, req.body.ids);

    if (deleteResults.affected === 0) {
        return reply.status(404).send({ message: "None of the picture does exist" });
    }

    return deleteResults;
}
