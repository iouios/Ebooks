import { db } from "@/app/admin/firebase/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const { bookId } = await req.json();

    const bookRef = db.collection("ebooks").doc(bookId);

    await bookRef.update({
      downloads: FieldValue.increment(1), 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update downloads:", error);
    return NextResponse.json({ message: "Failed to update downloads" }, { status: 500 });
  }
}
