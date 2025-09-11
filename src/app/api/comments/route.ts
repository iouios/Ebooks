import { NextRequest, NextResponse } from "next/server";
import { db } from "../../admin/firebase/firebaseAdmin"; 

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    return NextResponse.json({ message: "Missing bookId" }, { status: 400 });
  }

  try {
    const snapshot = await db
      .collection("comments")
      .where("bookId", "==", bookId)
      .get();

    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ comments });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 });
  }
}
