// src/app/api/webhooks/stripe/route.ts

import { db } from "@/db";
import { stripe } from "@/lib/sripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  // Read the request body and signature from headers
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  try {
    // Construct the Stripe event
    const event = stripe.webhooks.constructEvent(
      body,
      signature ?? "",
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const { userId } = session.metadata || { userId: null };

      // Validate metadata
      if (!userId) {
        return new Response("Invalid metadata", { status: 400 });
      }

      // Update user data in the database
      await db.user.update({
        where: { id: userId },
        data: { plan: "PRO" },
      });
    }

    // Return a success response
    return new Response("OK");
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Webhook Error: " + error.message, { status: 400 });
  }
}
