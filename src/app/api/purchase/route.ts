import { db } from "@/app/admin/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_id, book_id } = body;

    if (!user_id || !book_id) {
      return NextResponse.json({ message: "Missing input" }, { status: 400 });
    }

    const userRef = db.collection("users").doc(user_id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    if (!userData || typeof userData.token !== "number") {
      return NextResponse.json({ message: "User data not found" }, { status: 404 });
    }

    const ebookRef = db.collection("ebooks").doc(book_id);
    const ebookSnap = await ebookRef.get();

    if (!ebookSnap.exists) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const ebookData = ebookSnap.data();
    const price = ebookData?.price;

    if (typeof price !== "number") {
      return NextResponse.json({ message: "Invalid price data" }, { status: 500 });
    }

    if (userData.token < price) {
      return NextResponse.json({ message: "Token ไม่เพียงพอ" }, { status: 400 });
    }

    const existing = await db
      .collection("user_book")
      .where("user_id", "==", user_id)
      .where("book_id", "==", book_id)
      .where("is_refunded", "==", false)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ message: "คุณได้ซื้อหนังสือนี้แล้ว" }, { status: 400 });
    }

    const batch = db.batch();

    batch.update(userRef, {
      token: userData.token - price,
    });

    const logRef = db.collection("token_log").doc();
    batch.set(logRef, {
      user_id,
      book_id,
      amount: price,
      type: "spend",
      source: "purchase",
      created_at: new Date().toISOString(),
    });

    const userBookRef = db.collection("user_book").doc();
    batch.set(userBookRef, {
      user_id,
      book_id,
      purchase_date: new Date().toISOString(),
      price_at_purchase: price,
      token_used: userData.token,
      is_refunded: false,
      source: "token",
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Purchase failed:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
