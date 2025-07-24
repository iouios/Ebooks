import { db } from "@/app/admin/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ book_ids: [] }, { status: 400 });
    }

    const snapshot = await db
      .collection("user_book")
      .where("user_id", "==", userId)
      .where("is_refunded", "==", false)
      .get();

    const book_ids = snapshot.docs.map((doc) => doc.data().book_id);

    return NextResponse.json({ book_ids });
  } catch (error) {
    console.error("❌ Error fetching purchased books:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
