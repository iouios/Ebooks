import { NextResponse } from "next/server";
import { db } from "../../admin/firebase/firebaseConfig";
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing Stripe signature", { status: 400 });

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    console.log("Received event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.metadata?.userId || !session.metadata?.tokenAmount) {
        console.warn(" Missing userId or tokenAmount in session metadata");
        return NextResponse.json({ received: true });
      }

      const userId = session.metadata.userId;
      const tokenAmount = Number(session.metadata.tokenAmount);

      console.log("User ID:", userId);
      console.log("Token Amount:", tokenAmount);

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      let currentToken = 0;
      if (userSnap.exists()) {
        currentToken = userSnap.data()?.token ?? 0;
      }
      const newTokenBalance = currentToken + tokenAmount;
      await setDoc(userRef, { token: newTokenBalance, updatedAt: new Date().toISOString() }, { merge: true });

      const logsRef = collection(db, "token_log", userId, "logs");
      await addDoc(logsRef, {
        uid: userId,
        amount: tokenAmount,
        type: "deposit",
        balance: newTokenBalance,
        timestamp: new Date(),
        sessionId: session.id,
        status: "success",
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Firestore Error:", message);
    return new NextResponse(`Webhook handler failed: ${message}`, { status: 500 });
  }
}
