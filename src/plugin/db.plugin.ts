// Import Third-parties
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { DataSource } from "typeorm";

export async function dbConnection(server: FastifyInstance) {
    const dataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT) ?? 5432,
        username: process.env.DB_USERNAME ?? "postgres",
        password: process.env.DB_PASSWORD ?? "postgres",
        database: process.env.DB_NAME ?? "laconpote",
        synchronize: true,
        logging: true,
        ssl: {
            rejectUnauthorized: process.env.DB_SSL_CERT ? true : false,
            ca: process.env.DB_SSL_CERT
        },
        entities: [__dirname + './../entities/**/*.entity.{js,ts}']
    });


    await dataSource.initialize();

    server.decorate("dataSource", dataSource);
}

declare module "fastify" {
    interface FastifyInstance {
      dataSource: DataSource;
    }
  }
  

export const DBConnectionPlugin: FastifyPluginAsync = fp(dbConnection, { name: "DBConnectionPlugin" });
