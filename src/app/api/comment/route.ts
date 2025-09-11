import { NextRequest, NextResponse } from "next/server";
import { db, FieldValue } from "../../admin/firebase/firebaseAdmin";

export async function POST(request: NextRequest) {
  const { bookId, email , uid, displayName, text, rating } = await request.json();

  if (!bookId || !uid || !text) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const commentsCollection = db.collection("comments");
    await commentsCollection.add({
      bookId,
      email,
      uid,
      displayName,
      text,
      rating,
      createdAt: FieldValue.serverTimestamp(), 
    });

    return NextResponse.json({ message: "Comment saved successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
