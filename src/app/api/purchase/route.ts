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
      return NextResponse.json({ message: "User data not found or token invalid" }, { status: 404 });
    }

    const ebookRef = db.collection("ebooks").doc(book_id);
    const ebookSnap = await ebookRef.get();

    if (!ebookSnap.exists) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const ebookData = ebookSnap.data();
    let price = ebookData?.price;

    // ✅ ถ้าไม่มีการตั้งราคา → ให้ถือว่าเป็นหนังสือฟรี
    if (typeof price !== "number" || price < 0) {
      price = 0;
    }

    // ถ้าไม่ใช่ฟรี และ token ไม่พอ
    if (price > 0 && userData.token < price) {
      return NextResponse.json({ message: "Token ไม่เพียงพอ" }, { status: 400 });
    }

    // เช็คว่าผู้ใช้ซื้อหนังสือเล่มนี้แล้วหรือยัง
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

    // ถ้าไม่ใช่หนังสือฟรี → หัก token
    if (price > 0) {
      batch.update(userRef, {
        token: userData.token - price,
      });
    }

    // log token transaction (เฉพาะกรณีเสียเงิน)
    if (price > 0) {
      const logRef = db.collection("token_log").doc(user_id).collection("logs").doc();
      batch.set(logRef, {
        user_id,
        book_id,
        amount: price,
        type: "spend",
        source: "purchase",
        timestamp: new Date(),
      });
    }

    // เก็บว่า user รับ/ซื้อหนังสือ
    const userBookRef = db.collection("user_book").doc(user_id).collection("user_bookId").doc();
    batch.set(userBookRef, {
      user_id,
      book_id,
      purchase_date: new Date().toISOString(),
      price_at_purchase: price,
      token_used: price > 0 ? price : 0, // ✅ ฟรี → 0
      is_refunded: false,
      source: price > 0 ? "token" : "free", // ✅ เพิ่ม source free
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: price === 0 ? "ต้องการรับหนังสือ...หรือไม่" : "ซื้อสำเร็จ",
    });
  } catch (err) {
    console.error("❌ Purchase failed:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
