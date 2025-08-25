import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../admin/firebase/firebaseConfig";
import getRawBody from "raw-body";
import Stripe from "stripe";
import { serverTimestamp, increment, doc, setDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});
export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    if (event.type === "checkout.session.completed") {
      if (session.id && session.metadata?.userId && session.metadata?.tokenAmount) {
        const tokenLogRef = doc(db, "token_logs", session.id);
        await setDoc(tokenLogRef, {
          userId: session.metadata.userId,
          tokenAmount: Number(session.metadata.tokenAmount),
          status: "success",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const userRef = doc(db, "users", session.metadata.userId);
        await setDoc(
          userRef,
          {
            tokens: increment(Number(session.metadata.tokenAmount)),
          },
          { merge: true }
        );
      }
    }

    if (event.type === "checkout.session.async_payment_failed") {
      if (session.id) {
        const tokenLogRef = doc(db, "token_logs", session.id);
        await setDoc(
          tokenLogRef,
          {
            status: "failed",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    }

    res.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
}
