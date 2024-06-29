import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
	try {
		console.log("webhook");
		const StripeSignature = request.headers.get("stripe-signature");
		let event;
		const rawBody = await request.text();
		event = stripe.webhooks.constructEvent(
			rawBody,
			StripeSignature,
			process.env.STRIPE_WEBHOOK_SECRET_KEY
		);

		switch (event.type) {
			case "checkout.session.completed":
				const checkoutComplete = event.data.object;
				if (checkoutComplete.payment_status === "paid") {
					const { furnitureName, pricePerDay, numberOfDays, totalAmount } = checkoutComplete.metadata;
					console.log("Booking is completed. Details:");
					console.log({
						furnitureName,
						pricePerDay,
						numberOfDays,
						totalAmount,
						paymentIntent: checkoutComplete.payment_intent,
						customerEmail: checkoutComplete.customer_details.email
					});
				}
				break;
		}
		
		console.log("Webhook processing completed");
		return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
	} catch (error) {
		console.error("Webhook error:", error);
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
