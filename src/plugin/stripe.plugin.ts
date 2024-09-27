// Import Third-parties
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Stripe } from "stripe";

export async function stripeConnection(server: FastifyInstance) {
    const stripe = new Stripe(process.env.stripe_key);

    server.decorate("stripe", stripe);
}

declare module "fastify" {
    interface FastifyInstance {
      stripe: Stripe;
    }
  }
  

export const StripePlugin: FastifyPluginAsync = fp(stripeConnection, { name: "StripePlugin" });
