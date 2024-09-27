// Import Third-Party Dependencies
import { FastifyRequest, FastifyReply } from "fastify";
import * as httpie from "@myunisoft/httpie";

// Import Internal Dependencies
import { Product } from "../../entities";

// CONSTANTS
const paypalDomain = process.env.PAYPAL_URI ?? "https://api-m.sandbox.paypal.com";

export type CheckoutRequest = FastifyRequest<{
    Body: Array<Partial<Product> & { quantity: number; }>;
}>;

// export async function checkout(req: CheckoutRequest, res: FastifyReply) {
//     const session = await req.server.stripe.checkout.sessions.create({
//         line_items: [
//             {
//                 price_data: {
//                     currency: "EUR",
//                     product_data: {
//                         name: "FOO",
//                         description: "description",
//                         // images: [""]
//                     },
//                     unit_amount: 1 
//                 },
//                 quantity: 1
//             }
//         ],
//         mode: "payment",
//         success_url: "localhost:4200/payment/success.html",
//         cancel_url: "localhost:4200/payment/cancel.html"
//     });

//     res.redirect(303, session.url);
// }

export async function createOrder(req: CheckoutRequest, res: FastifyReply) {
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "EUR",
                    value: 100
                }
            }
        ]
    };

    const postResult = await httpie.safePost(`${paypalDomain}/v2/checkout/orders`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.paypalToken}`,
        },
        body: JSON.stringify(payload)
    });

    return postResult.unwrap();
}

export type CaptureOrderRequest = FastifyRequest<{
    Params: {
        orderID: string;
    }
}>;

export async function captureOrder(req: CaptureOrderRequest) {
    const orderId = req.params.orderID;

    const postResult = await httpie.post(`${paypalDomain}/v2/checkout/orders/${orderId}/capture`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.paypalToken}`
        }
    });

    return postResult;
}
