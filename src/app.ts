// Import Node.js
import { join } from "node:path";

// Import Third-parties
import fastify, { FastifyInstance } from "fastify";
import autoLoad from "@fastify/autoload";

// Import Internals
import { healthPlugin } from "./plugin/health.plugin";
import { swaggerPlugin } from "./plugin/swagger.plugin";
import { DBConnectionPlugin } from "./plugin/db.plugin";
import { defaultPlugin } from "./plugin/default.plugin";
import { stripeConnection } from "./plugin/stripe.plugin";

export function buildServer(): FastifyInstance {
  const app = fastify({
    logger: true
  });

  app.register(defaultPlugin);
  app.register(healthPlugin);
  app.register(swaggerPlugin);
  // app.register(DBConnectionPlugin);
  // app.register(stripeConnection);

  app.register(autoLoad, {
    dir: join(__dirname, "./feature"),
    dirNameRoutePrefix: false,
    ignorePattern: /.*(test|spec).ts/,
    indexPattern: /route(\.ts|\.js)$/,
    autoHooks: false,
    options: {
      prefix: "/api/v1/"
    }
  });

  return app;
}
