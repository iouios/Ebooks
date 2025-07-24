import { db } from "@/app/admin/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, book_id } = body;

    if (!user_id || !book_id) {
      return NextResponse.json({ message: "Missing input" }, { status: 400 });
    }

    const docRef = db
      .collection("user_book")
      .where("user_id", "==", user_id)
      .where("book_id", "==", book_id)
      .where("is_refunded", "==", false);

    const snapshot = await docRef.get();

    const purchased = !snapshot.empty;

    return NextResponse.json({ purchased });
  } catch (err) {
    console.error("Error checking purchase:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
