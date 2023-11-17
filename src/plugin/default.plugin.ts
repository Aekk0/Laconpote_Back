// Import Third-parties
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import helmet from "@fastify/helmet";
import * as jsonpatch from "fast-json-patch";
import Ajv from "ajv";

// Import Internals
import fastifyCors from "@fastify/cors";
import jsonPatchSchema from "../schema/json-patch.schema.json";

const ajv = new Ajv({ allErrors: true, messages: false });

export interface PatchOptions {
    /**
     * A list of paths that can't be patched.
     * If an operation of the given patch has one of the path in that list, it will be ignored.
     */
    forbiddenPaths?: string[];
    /**
     * If true, when one or several operations use a forbidden path, error will be thrown
     */
    throwOnForbiddenPath?: boolean;
    /**
     * JSON Schema that patched object must respect
     */
    schema?: any;
}

export function applyJsonPatch(document: any, patch: jsonpatch.Operation[], options: PatchOptions = {}): any {
  const { throwOnForbiddenPath = true } = options;
  const forbiddenOperations: jsonpatch.Operation[] = [];

  const forbiddenPaths = new Set(options.forbiddenPaths ?? []);

  const filterPatch = patch.filter((operation) => {
    const isForbiddenPath = forbiddenPaths.has(operation.path);

    if (isForbiddenPath && throwOnForbiddenPath) {
      forbiddenOperations.push(operation);
    }

    return !isForbiddenPath;
  });

  if (forbiddenOperations.length > 0) {
    throw this.myUnisoftErrors.invalidPatchApply(`Operation(s) on forbidden path(s): ${JSON.stringify(forbiddenOperations)}`);
  }

  const patchedObject = jsonpatch.applyPatch(document, filterPatch).newDocument;

  if (options.schema) {
    const isValid = ajv.validate(options.schema, patchedObject);
    if (!isValid) {
      throw this.myUnisoftErrors.invalidPatchApply(`Patched document validation error(s): ${JSON.stringify(ajv.errors)}`);
    }
  }

  return patchedObject;
}

export async function defaultFn(server: FastifyInstance) {
    server.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [`'self'`],
                styleSrc: [`'self'`, `'unsafe-inline'`],
                imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
                scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
            }
        }
    });

    server.register(fastifyCors, {
        credentials: true,
        origin: true
    });

    server.addSchema(jsonPatchSchema);
    server.decorate("applyJsonPatch", applyJsonPatch);
}

declare module "fastify" {
    interface FastifyInstance {
      /**
       *
       * @param document JSON document on with patch will be applied
       * @param patch a JSON patch (https://datatracker.ietf.org/doc/html/rfc6902)
       * @param options Additional options
       * @returns Patched JSON document
       */
      applyJsonPatch: (document: any, patch: jsonpatch.Operation[], options?: PatchOptions) => any;
    }
  }

export const defaultPlugin: FastifyPluginAsync = fp(defaultFn, { name: "defaultPlugin" });
