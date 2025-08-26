import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, tokenAmount } = body;
    if (!userId || !tokenAmount) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: `${tokenAmount} Token`,
            },
            unit_amount: tokenAmount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/token-status?status=success",
      cancel_url: "http://localhost:3000/token-status?status=fail",
      metadata: { userId, tokenAmount },
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
