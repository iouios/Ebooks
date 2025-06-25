import { db } from "@/app/admin/firebase/firebaseAdmin";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, userSub } = await request.json();

    if (!userSub) {
      return NextResponse.json({ error: "Missing userSub" }, { status: 400 });
    }

    const tokenAmount = Number(amount);
    if (isNaN(tokenAmount) || tokenAmount <= 0 || tokenAmount > 1000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const userRef = db.collection("users").doc(userSub);
    const userDoc = await userRef.get();

    let currentToken = 0;
    if (userDoc.exists) {
      const userData = userDoc.data();
      currentToken = userData?.token ?? 0;
    }

    const newTokenBalance = currentToken + tokenAmount;

    // Update token ใน users
    await userRef.set(
      {
        token: newTokenBalance,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    await db.collection("token_log").doc(userSub).collection("logs").add({
      uid: userSub,
      amount: tokenAmount,
      type: "deposit",
      balance: newTokenBalance,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, balance: newTokenBalance });
  } catch (error) {
    console.error("Error topping up token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
