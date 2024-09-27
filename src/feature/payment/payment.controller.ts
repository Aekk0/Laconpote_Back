// Import Third-Party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";
import { Stripe } from "stripe";

// Import Internal Dependencies
import { Product } from "../../entities";

export type CheckoutRequest = FastifyRequest<{
    Body: Array<Partial<Product> & { quantity: number; }>;
}>;

export async function checkout(req: CheckoutRequest, res: FastifyReply) {
    const session = await req.server.stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "EUR",
                    product_data: {
                        name: "FOO",
                        description: "description",
                        // images: [""]
                    },
                    unit_amount: 1 
                },
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: "localhost:4200/payment/success.html",
        cancel_url: "localhost:4200/payment/cancel.html"
    });

    res.redirect(303, session.url);
}
