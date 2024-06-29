import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function GetActiveProducts() {
    const products = await stripe.products.list();
    return products.data.filter((product) => product.active === true);
}

export async function POST(request) {
    try {
        const { furnitureName, pricePerDay, numberOfDays } = await request.json();

        let availableProducts = await GetActiveProducts();

        let existingProduct = availableProducts.find(
            (product) => product.name.toLowerCase() === furnitureName.toLowerCase()
        );

        if (!existingProduct) {
            existingProduct = await stripe.products.create({
                name: furnitureName,
                default_price_data: {
                    unit_amount: pricePerDay * 100, // Stripe uses cents
                    currency: "INR",
                },
            });
        }

        const totalAmount = pricePerDay * numberOfDays;

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price: existingProduct.default_price,
                    quantity: numberOfDays,
                },
            ],
            success_url: `${request.headers.get("origin")}/`,
            cancel_url: `${request.headers.get("origin")}/payment-failed`,
            metadata: {
                furnitureName,
                pricePerDay,
                numberOfDays,
                totalAmount,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe session creation error:", error);
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
}
