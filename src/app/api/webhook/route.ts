import { NextResponse } from "next/server";
import { db } from "../../admin/firebase/firebaseAdmin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig)
    return new NextResponse("Missing Stripe signature", { status: 400 });

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const tokenAmount = Number(session.metadata?.tokenAmount);

      if (!userId || !tokenAmount) return NextResponse.json({ received: true });

      const paymentIntentId = session.payment_intent as string;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      const paymentMethodId = paymentIntent.payment_method as string;
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentMethodId
      );

      // เก็บแค่ brand เป็น string
      const paymentBrand = paymentMethod.card?.brand ?? null;

      const userRef = db.collection("users").doc(userId);
      const userSnap = await userRef.get();
      const currentToken = userSnap.exists ? userSnap.data()?.token ?? 0 : 0;
      const newTokenBalance = currentToken + tokenAmount;

      await userRef.set(
        {
          token: newTokenBalance,
          paymentMethod: paymentBrand,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      const logsRef = db.collection("token_log").doc(userId).collection("logs");
      await logsRef.add({
        uid: userId,
        email: session.customer_details?.email,
        amount: tokenAmount,
        type: "deposit",
        balance: newTokenBalance,
        timestamp: new Date(),
        sessionId: session.id,
        status: "success",
        paymentMethod: paymentBrand,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return new NextResponse(
      `Webhook handler failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}
